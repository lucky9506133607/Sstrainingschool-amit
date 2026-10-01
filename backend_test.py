#!/usr/bin/env python3
"""
Backend API Testing Script for SS Training School
Tests Newsletter API endpoint
"""

import requests
import json
import os
import sys
from pymongo import MongoClient
from datetime import datetime
import uuid

# Configuration
BASE_URL = "https://sstraining-staging.preview.emergentagent.com"
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "sstraining_school"

def print_test_header(test_name):
    """Print formatted test header"""
    print(f"\n{'='*80}")
    print(f"TEST: {test_name}")
    print(f"{'='*80}")

def print_result(success, message):
    """Print test result"""
    status = "✓ PASS" if success else "✗ FAIL"
    print(f"{status}: {message}")

def get_mongo_client():
    """Get MongoDB client"""
    return MongoClient(MONGO_URL)

def verify_mongo_document(collection_name, query, expected_fields=None):
    """Verify document exists in MongoDB with expected fields"""
    try:
        client = get_mongo_client()
        db = client[DB_NAME]
        collection = db[collection_name]
        doc = collection.find_one(query)
        
        if not doc:
            return False, "Document not found in MongoDB"
        
        if expected_fields:
            missing_fields = [f for f in expected_fields if f not in doc]
            if missing_fields:
                return False, f"Missing fields: {missing_fields}"
        
        return True, doc
    except Exception as e:
        return False, f"MongoDB error: {str(e)}"
    finally:
        client.close()

def count_mongo_documents(collection_name, query):
    """Count documents matching query"""
    try:
        client = get_mongo_client()
        db = client[DB_NAME]
        collection = db[collection_name]
        count = collection.count_documents(query)
        return count
    except Exception as e:
        print(f"MongoDB count error: {str(e)}")
        return -1
    finally:
        client.close()

def test_newsletter_get():
    """Test GET /api/newsletter"""
    print_test_header("Newsletter GET Endpoint")
    
    try:
        url = f"{BASE_URL}/api/newsletter"
        response = requests.get(url, timeout=10)
        
        print(f"URL: {url}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") == True and data.get("service") == "newsletter":
                print_result(True, "GET endpoint returns correct response")
                return True
            else:
                print_result(False, f"Unexpected response data: {data}")
                return False
        else:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_newsletter_valid_new_email():
    """Test POST /api/newsletter with valid new email"""
    print_test_header("Newsletter POST - Valid New Email")
    
    # Generate unique email
    random_id = str(uuid.uuid4())[:8]
    email = f"subscriber_{random_id}@example.com"
    
    try:
        url = f"{BASE_URL}/api/newsletter"
        payload = {"email": email}
        
        print(f"URL: {url}")
        print(f"Payload: {json.dumps(payload)}")
        
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check HTTP status
        if response.status_code != 201:
            print_result(False, f"Expected status 201, got {response.status_code}")
            return False, email
        
        # Check response body
        data = response.json()
        if not data.get("ok"):
            print_result(False, f"Expected ok:true, got {data}")
            return False, email
        
        print_result(True, "API returned HTTP 201 with ok:true")
        
        # Verify MongoDB document
        print("\nVerifying MongoDB document...")
        expected_fields = ["id", "email", "createdAt", "source"]
        success, result = verify_mongo_document(
            "newsletter_subscribers",
            {"email": email.lower()},
            expected_fields
        )
        
        if not success:
            print_result(False, f"MongoDB verification failed: {result}")
            return False, email
        
        doc = result
        print(f"Document found: {json.dumps({k: str(v) for k, v in doc.items() if k != '_id'}, indent=2)}")
        
        # Verify field values
        checks = []
        checks.append(("id is UUID", isinstance(doc.get("id"), str) and len(doc.get("id", "")) == 36))
        checks.append(("email is lowercased", doc.get("email") == email.lower()))
        checks.append(("createdAt exists", isinstance(doc.get("createdAt"), datetime)))
        checks.append(("source is 'newsletter'", doc.get("source") == "newsletter"))
        
        all_passed = all(check[1] for check in checks)
        for check_name, passed in checks:
            print_result(passed, check_name)
        
        if all_passed:
            print_result(True, "MongoDB document verified with all required fields")
            return True, email
        else:
            print_result(False, "Some MongoDB field checks failed")
            return False, email
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False, email

def test_newsletter_duplicate_email(email):
    """Test POST /api/newsletter with duplicate email"""
    print_test_header("Newsletter POST - Duplicate Email")
    
    try:
        # First, verify the email exists
        count_before = count_mongo_documents("newsletter_subscribers", {"email": email.lower()})
        print(f"Documents with email '{email}' before duplicate POST: {count_before}")
        
        if count_before != 1:
            print_result(False, f"Expected 1 existing document, found {count_before}")
            return False
        
        url = f"{BASE_URL}/api/newsletter"
        payload = {"email": email}
        
        print(f"URL: {url}")
        print(f"Payload: {json.dumps(payload)}")
        
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check HTTP status
        if response.status_code != 200:
            print_result(False, f"Expected status 200, got {response.status_code}")
            return False
        
        # Check response body
        data = response.json()
        if not (data.get("ok") == True and data.get("already") == True):
            print_result(False, f"Expected {{ok:true, already:true}}, got {data}")
            return False
        
        print_result(True, "API returned HTTP 200 with ok:true and already:true")
        
        # Verify no second document was inserted
        count_after = count_mongo_documents("newsletter_subscribers", {"email": email.lower()})
        print(f"Documents with email '{email}' after duplicate POST: {count_after}")
        
        if count_after == count_before:
            print_result(True, f"No duplicate document inserted (count stayed at {count_after})")
            return True
        else:
            print_result(False, f"Document count changed from {count_before} to {count_after}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_newsletter_invalid_email():
    """Test POST /api/newsletter with invalid email format"""
    print_test_header("Newsletter POST - Invalid Email Format")
    
    try:
        url = f"{BASE_URL}/api/newsletter"
        payload = {"email": "not-an-email"}
        
        print(f"URL: {url}")
        print(f"Payload: {json.dumps(payload)}")
        
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check HTTP status
        if response.status_code != 400:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
        
        # Check response has error message
        data = response.json()
        if "error" not in data:
            print_result(False, f"Expected 'error' field in response, got {data}")
            return False
        
        print_result(True, f"API returned HTTP 400 with error: {data['error']}")
        
        # Verify no document was inserted
        count = count_mongo_documents("newsletter_subscribers", {"email": "not-an-email"})
        if count == 0:
            print_result(True, "No document inserted for invalid email")
            return True
        else:
            print_result(False, f"Found {count} documents with invalid email")
            return False
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_newsletter_missing_email():
    """Test POST /api/newsletter with missing email"""
    print_test_header("Newsletter POST - Missing Email")
    
    try:
        url = f"{BASE_URL}/api/newsletter"
        payload = {}
        
        print(f"URL: {url}")
        print(f"Payload: {json.dumps(payload)}")
        
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check HTTP status
        if response.status_code != 400:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
        
        # Check response has error message
        data = response.json()
        if "error" not in data:
            print_result(False, f"Expected 'error' field in response, got {data}")
            return False
        
        print_result(True, f"API returned HTTP 400 with error: {data['error']}")
        return True
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_newsletter_invalid_json():
    """Test POST /api/newsletter with invalid JSON"""
    print_test_header("Newsletter POST - Invalid JSON")
    
    try:
        url = f"{BASE_URL}/api/newsletter"
        
        print(f"URL: {url}")
        print(f"Payload: Invalid JSON string")
        
        response = requests.post(
            url,
            data="not valid json",
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check HTTP status
        if response.status_code != 400:
            print_result(False, f"Expected status 400, got {response.status_code}")
            return False
        
        # Check response has error message
        data = response.json()
        if "error" not in data:
            print_result(False, f"Expected 'error' field in response, got {data}")
            return False
        
        print_result(True, f"API returned HTTP 400 with error: {data['error']}")
        return True
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def test_newsletter_case_insensitivity(email):
    """Test POST /api/newsletter with uppercase variant of existing email"""
    print_test_header("Newsletter POST - Case Insensitivity (Uppercase Variant)")
    
    try:
        # Create uppercase variant
        uppercase_email = email.upper()
        
        # Verify original email exists
        count_before = count_mongo_documents("newsletter_subscribers", {"email": email.lower()})
        print(f"Documents with email '{email.lower()}' before uppercase POST: {count_before}")
        
        if count_before < 1:
            print_result(False, f"Original email not found in database")
            return False
        
        url = f"{BASE_URL}/api/newsletter"
        payload = {"email": uppercase_email}
        
        print(f"URL: {url}")
        print(f"Payload: {json.dumps(payload)} (uppercase variant)")
        
        response = requests.post(url, json=payload, timeout=10)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Check HTTP status
        if response.status_code != 200:
            print_result(False, f"Expected status 200 (duplicate), got {response.status_code}")
            return False
        
        # Check response body
        data = response.json()
        if not (data.get("ok") == True and data.get("already") == True):
            print_result(False, f"Expected {{ok:true, already:true}}, got {data}")
            return False
        
        print_result(True, "API correctly treated uppercase email as duplicate")
        
        # Verify no new document was inserted
        count_after = count_mongo_documents("newsletter_subscribers", {"email": email.lower()})
        print(f"Documents with email '{email.lower()}' after uppercase POST: {count_after}")
        
        if count_after == count_before:
            print_result(True, f"No duplicate document inserted (count stayed at {count_after})")
            return True
        else:
            print_result(False, f"Document count changed from {count_before} to {count_after}")
            return False
            
    except Exception as e:
        print_result(False, f"Exception: {str(e)}")
        return False

def main():
    """Run all newsletter API tests"""
    print("\n" + "="*80)
    print("SS TRAINING SCHOOL - NEWSLETTER API TESTING")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"MongoDB: {MONGO_URL}/{DB_NAME}")
    print(f"Collection: newsletter_subscribers")
    
    results = []
    test_email = None
    
    # Test 1: GET endpoint
    results.append(("GET /api/newsletter", test_newsletter_get()))
    
    # Test 2: Valid new email
    success, email = test_newsletter_valid_new_email()
    results.append(("POST valid new email", success))
    test_email = email
    
    # Test 3: Duplicate email (only if previous test passed)
    if success and test_email:
        results.append(("POST duplicate email", test_newsletter_duplicate_email(test_email)))
    else:
        print("\nSkipping duplicate email test (previous test failed)")
        results.append(("POST duplicate email", False))
    
    # Test 4: Invalid email format
    results.append(("POST invalid email format", test_newsletter_invalid_email()))
    
    # Test 5: Missing email
    results.append(("POST missing email", test_newsletter_missing_email()))
    
    # Test 6: Invalid JSON
    results.append(("POST invalid JSON", test_newsletter_invalid_json()))
    
    # Test 7: Case insensitivity (only if we have a test email)
    if test_email:
        results.append(("POST case insensitivity", test_newsletter_case_insensitivity(test_email)))
    else:
        print("\nSkipping case insensitivity test (no test email available)")
        results.append(("POST case insensitivity", False))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
