#!/usr/bin/env python3
"""
Backend API Testing for SS Training School Contact API
Tests POST /api/contact with validation, MongoDB persistence, and Resend resilience
"""

import requests
import json
import os
from pymongo import MongoClient
from datetime import datetime

# Configuration from environment
BASE_URL = os.getenv("NEXT_PUBLIC_BASE_URL", "https://sstraining-staging.preview.emergentagent.com")
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "sstraining_school")

API_ENDPOINT = f"{BASE_URL}/api/contact"

print("=" * 80)
print("SS Training School Contact API Testing")
print("=" * 80)
print(f"Base URL: {BASE_URL}")
print(f"API Endpoint: {API_ENDPOINT}")
print(f"MongoDB: {MONGO_URL}")
print(f"Database: {DB_NAME}")
print("=" * 80)

# MongoDB connection
try:
    mongo_client = MongoClient(MONGO_URL)
    db = mongo_client[DB_NAME]
    collection = db["contact_leads"]
    print(f"✓ MongoDB connected successfully")
except Exception as e:
    print(f"✗ MongoDB connection failed: {e}")
    exit(1)

print("=" * 80)

# Test counters
tests_passed = 0
tests_failed = 0
test_results = []

def log_test(test_name, passed, details=""):
    global tests_passed, tests_failed
    status = "✓ PASS" if passed else "✗ FAIL"
    print(f"\n{status}: {test_name}")
    if details:
        print(f"  Details: {details}")
    test_results.append({"test": test_name, "passed": passed, "details": details})
    if passed:
        tests_passed += 1
    else:
        tests_failed += 1

def verify_mongo_document(lead_id, expected_fields):
    """Verify a document exists in MongoDB with expected fields"""
    try:
        doc = collection.find_one({"id": lead_id})
        if not doc:
            return False, "Document not found in MongoDB"
        
        missing_fields = []
        for field in expected_fields:
            if field not in doc:
                missing_fields.append(field)
        
        if missing_fields:
            return False, f"Missing fields: {missing_fields}"
        
        return True, f"Document found with all expected fields"
    except Exception as e:
        return False, f"MongoDB query error: {str(e)}"

def count_documents_before_after(email):
    """Count documents with a specific email before and after operation"""
    try:
        return collection.count_documents({"email": email.lower()})
    except Exception as e:
        print(f"  MongoDB count error: {e}")
        return -1

# ============================================================================
# TEST 1: GET /api/contact - Health check
# ============================================================================
print("\n" + "=" * 80)
print("TEST 1: GET /api/contact (Health Check)")
print("=" * 80)

try:
    response = requests.get(API_ENDPOINT, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") == True:
            log_test("GET /api/contact returns {ok:true}", True, f"Response: {data}")
        else:
            log_test("GET /api/contact returns {ok:true}", False, f"Expected ok:true, got: {data}")
    else:
        log_test("GET /api/contact returns {ok:true}", False, f"Expected 200, got {response.status_code}")
except Exception as e:
    log_test("GET /api/contact returns {ok:true}", False, f"Request failed: {str(e)}")

# ============================================================================
# TEST 2: Valid POST - Full submission with all fields
# ============================================================================
print("\n" + "=" * 80)
print("TEST 2: Valid POST /api/contact (Full Submission)")
print("=" * 80)

valid_payload = {
    "fullName": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "9876543210",
    "whatsapp": "9876543210",
    "course": "Beginner Car Driving",
    "message": "Please contact me for morning slots"
}

print(f"Payload: {json.dumps(valid_payload, indent=2)}")

try:
    # Count before
    count_before = count_documents_before_after(valid_payload["email"])
    print(f"Documents before: {count_before}")
    
    response = requests.post(API_ENDPOINT, json=valid_payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        data = response.json()
        
        # Check response structure
        if data.get("ok") == True and "id" in data and data["id"]:
            lead_id = data["id"]
            print(f"  Lead ID: {lead_id}")
            
            # Verify MongoDB document
            doc_exists, doc_msg = verify_mongo_document(lead_id, [
                "id", "fullName", "email", "phone", "whatsapp", "course", "message", "createdAt"
            ])
            
            if doc_exists:
                # Verify email is lowercased
                doc = collection.find_one({"id": lead_id})
                if doc["email"] == valid_payload["email"].lower():
                    log_test("Valid POST returns 201 with ok:true, id, and MongoDB document", True, 
                            f"Lead saved with ID {lead_id}, email lowercased correctly")
                else:
                    log_test("Valid POST returns 201 with ok:true, id, and MongoDB document", False, 
                            f"Email not lowercased: expected {valid_payload['email'].lower()}, got {doc['email']}")
            else:
                log_test("Valid POST returns 201 with ok:true, id, and MongoDB document", False, 
                        f"Response OK but MongoDB verification failed: {doc_msg}")
        else:
            log_test("Valid POST returns 201 with ok:true, id, and MongoDB document", False, 
                    f"Response missing ok:true or id. Got: {data}")
    else:
        log_test("Valid POST returns 201 with ok:true, id, and MongoDB document", False, 
                f"Expected 201, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("Valid POST returns 201 with ok:true, id, and MongoDB document", False, f"Request failed: {str(e)}")

# ============================================================================
# TEST 3: Validation Error - Missing fullName
# ============================================================================
print("\n" + "=" * 80)
print("TEST 3: Validation Error - Missing fullName")
print("=" * 80)

invalid_payload_1 = {
    "email": "test@example.com",
    "phone": "9876543210",
    "course": "Beginner Car Driving"
}

print(f"Payload: {json.dumps(invalid_payload_1, indent=2)}")

try:
    count_before = count_documents_before_after(invalid_payload_1["email"])
    
    response = requests.post(API_ENDPOINT, json=invalid_payload_1, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    count_after = count_documents_before_after(invalid_payload_1["email"])
    
    if response.status_code == 400:
        data = response.json()
        if "error" in data and count_before == count_after:
            log_test("Missing fullName returns 400 with error, no MongoDB insert", True, 
                    f"Error: {data['error']}, no document inserted")
        elif "error" not in data:
            log_test("Missing fullName returns 400 with error, no MongoDB insert", False, 
                    f"Response missing 'error' field: {data}")
        else:
            log_test("Missing fullName returns 400 with error, no MongoDB insert", False, 
                    f"Document was inserted (count changed from {count_before} to {count_after})")
    else:
        log_test("Missing fullName returns 400 with error, no MongoDB insert", False, 
                f"Expected 400, got {response.status_code}")
except Exception as e:
    log_test("Missing fullName returns 400 with error, no MongoDB insert", False, f"Request failed: {str(e)}")

# ============================================================================
# TEST 4: Validation Error - Invalid email
# ============================================================================
print("\n" + "=" * 80)
print("TEST 4: Validation Error - Invalid email")
print("=" * 80)

invalid_payload_2 = {
    "fullName": "Test User",
    "email": "not-an-email",
    "phone": "9876543210",
    "course": "Beginner Car Driving"
}

print(f"Payload: {json.dumps(invalid_payload_2, indent=2)}")

try:
    # Use a unique identifier to check for insertion
    unique_name = "Test User Invalid Email Check"
    invalid_payload_2["fullName"] = unique_name
    
    count_before = collection.count_documents({"fullName": unique_name})
    
    response = requests.post(API_ENDPOINT, json=invalid_payload_2, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    count_after = collection.count_documents({"fullName": unique_name})
    
    if response.status_code == 400:
        data = response.json()
        if "error" in data and count_before == count_after:
            log_test("Invalid email returns 400 with error, no MongoDB insert", True, 
                    f"Error: {data['error']}, no document inserted")
        elif "error" not in data:
            log_test("Invalid email returns 400 with error, no MongoDB insert", False, 
                    f"Response missing 'error' field: {data}")
        else:
            log_test("Invalid email returns 400 with error, no MongoDB insert", False, 
                    f"Document was inserted (count changed from {count_before} to {count_after})")
    else:
        log_test("Invalid email returns 400 with error, no MongoDB insert", False, 
                f"Expected 400, got {response.status_code}")
except Exception as e:
    log_test("Invalid email returns 400 with error, no MongoDB insert", False, f"Request failed: {str(e)}")

# ============================================================================
# TEST 5: Validation Error - Missing course
# ============================================================================
print("\n" + "=" * 80)
print("TEST 5: Validation Error - Missing course")
print("=" * 80)

invalid_payload_3 = {
    "fullName": "Test User",
    "email": "test3@example.com",
    "phone": "9876543210"
}

print(f"Payload: {json.dumps(invalid_payload_3, indent=2)}")

try:
    count_before = count_documents_before_after(invalid_payload_3["email"])
    
    response = requests.post(API_ENDPOINT, json=invalid_payload_3, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    count_after = count_documents_before_after(invalid_payload_3["email"])
    
    if response.status_code == 400:
        data = response.json()
        if "error" in data and count_before == count_after:
            log_test("Missing course returns 400 with error, no MongoDB insert", True, 
                    f"Error: {data['error']}, no document inserted")
        elif "error" not in data:
            log_test("Missing course returns 400 with error, no MongoDB insert", False, 
                    f"Response missing 'error' field: {data}")
        else:
            log_test("Missing course returns 400 with error, no MongoDB insert", False, 
                    f"Document was inserted (count changed from {count_before} to {count_after})")
    else:
        log_test("Missing course returns 400 with error, no MongoDB insert", False, 
                f"Expected 400, got {response.status_code}")
except Exception as e:
    log_test("Missing course returns 400 with error, no MongoDB insert", False, f"Request failed: {str(e)}")

# ============================================================================
# TEST 6: Validation Error - Empty body
# ============================================================================
print("\n" + "=" * 80)
print("TEST 6: Validation Error - Empty body")
print("=" * 80)

try:
    response = requests.post(API_ENDPOINT, json={}, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        data = response.json()
        if "error" in data:
            log_test("Empty body returns 400 with error", True, f"Error: {data['error']}")
        else:
            log_test("Empty body returns 400 with error", False, f"Response missing 'error' field: {data}")
    else:
        log_test("Empty body returns 400 with error", False, f"Expected 400, got {response.status_code}")
except Exception as e:
    log_test("Empty body returns 400 with error", False, f"Request failed: {str(e)}")

# ============================================================================
# TEST 7: Validation Error - Invalid JSON
# ============================================================================
print("\n" + "=" * 80)
print("TEST 7: Validation Error - Invalid JSON")
print("=" * 80)

try:
    response = requests.post(API_ENDPOINT, data="not-json", headers={"Content-Type": "application/json"}, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 400:
        data = response.json()
        if "error" in data:
            log_test("Invalid JSON returns 400 with error", True, f"Error: {data['error']}")
        else:
            log_test("Invalid JSON returns 400 with error", False, f"Response missing 'error' field: {data}")
    else:
        log_test("Invalid JSON returns 400 with error", False, f"Expected 400, got {response.status_code}")
except Exception as e:
    log_test("Invalid JSON returns 400 with error", False, f"Request failed: {str(e)}")

# ============================================================================
# TEST 8: CRITICAL - Resend failure resilience
# ============================================================================
print("\n" + "=" * 80)
print("TEST 8: CRITICAL - Resend Failure Resilience")
print("=" * 80)
print("Testing that lead is saved even if Resend email delivery fails")
print("(onboarding@resend.dev sender may reject non-owner addresses)")

resilience_payload = {
    "fullName": "Priya Patel",
    "email": "priya.patel.test@example.com",
    "phone": "9123456789",
    "whatsapp": "9123456789",
    "course": "Advanced Car Driving",
    "message": "I need training for highway driving"
}

print(f"Payload: {json.dumps(resilience_payload, indent=2)}")

try:
    count_before = count_documents_before_after(resilience_payload["email"])
    print(f"Documents before: {count_before}")
    
    response = requests.post(API_ENDPOINT, json=resilience_payload, timeout=10)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        data = response.json()
        
        # Check response structure
        if data.get("ok") == True and "id" in data and data["id"]:
            lead_id = data["id"]
            print(f"  Lead ID: {lead_id}")
            print(f"  Email Sent: {data.get('emailSent', 'N/A')}")
            print(f"  Confirmation Sent: {data.get('confirmationSent', 'N/A')}")
            
            # Verify MongoDB document exists regardless of email status
            doc_exists, doc_msg = verify_mongo_document(lead_id, [
                "id", "fullName", "email", "phone", "whatsapp", "course", "message", "createdAt"
            ])
            
            if doc_exists:
                # This is the CRITICAL test - lead must be saved even if emails fail
                log_test("CRITICAL: Lead saved to MongoDB even if Resend fails", True, 
                        f"Lead {lead_id} persisted successfully. emailSent={data.get('emailSent')}, confirmationSent={data.get('confirmationSent')}")
            else:
                log_test("CRITICAL: Lead saved to MongoDB even if Resend fails", False, 
                        f"Response OK but MongoDB verification failed: {doc_msg}")
        else:
            log_test("CRITICAL: Lead saved to MongoDB even if Resend fails", False, 
                    f"Response missing ok:true or id. Got: {data}")
    else:
        log_test("CRITICAL: Lead saved to MongoDB even if Resend fails", False, 
                f"Expected 201, got {response.status_code}: {response.text}")
except Exception as e:
    log_test("CRITICAL: Lead saved to MongoDB even if Resend fails", False, f"Request failed: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total Tests: {tests_passed + tests_failed}")
print(f"Passed: {tests_passed}")
print(f"Failed: {tests_failed}")
print("=" * 80)

if tests_failed > 0:
    print("\nFailed Tests:")
    for result in test_results:
        if not result["passed"]:
            print(f"  ✗ {result['test']}")
            if result["details"]:
                print(f"    {result['details']}")

print("\n" + "=" * 80)
print("Testing Complete")
print("=" * 80)

# Close MongoDB connection
mongo_client.close()

# Exit with appropriate code
exit(0 if tests_failed == 0 else 1)
