#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "SS Training School single-page website. Contact form saves leads to MongoDB and sends Resend email notifications. Lead must be saved even if Resend fails."

backend:
  - task: "Contact API - POST /api/contact (validation, MongoDB save, Resend email best-effort)"
    implemented: true
    working: true
    file: "app/api/contact/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "New contact route. Zod server validation, saves to 'contact_leads' collection with UUID id, then best-effort Resend notification + confirmation email. Email failure must NOT fail the request (should return 201 with emailSent flag). Uses MONGO_URL locally. Resend uses onboarding@resend.dev sender (may reject sends to non-owner addresses but lead must still save)."
        -working: true
        -agent: "testing"
        -comment: "✓ ALL TESTS PASSED (8/8). Tested: (1) GET /api/contact returns {ok:true,service:contact}. (2) Valid POST with full payload returns HTTP 201 with {ok:true, id:<UUID>, emailSent, confirmationSent}. Verified MongoDB document inserted in 'contact_leads' collection with all required fields (id, fullName, email lowercased, phone, whatsapp, course, message, createdAt, source). (3) Validation errors correctly return HTTP 400 with error message and NO MongoDB insert for: missing fullName, invalid email format, missing course, empty body, invalid JSON. (4) CRITICAL RESILIENCE VERIFIED: Lead persistence does NOT depend on Resend email success. Even when confirmationSent=false (Resend onboarding@resend.dev sender limitation), the API returns HTTP 201 with ok:true and the lead is successfully saved to MongoDB. Tested with two different email addresses - both leads persisted correctly. MongoDB verification confirmed 2 documents created with proper structure and data integrity."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 1
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    -agent: "main"
    -message: "Please test POST /api/contact. Scenarios: (1) Valid payload {fullName,email,phone,whatsapp,course,message} returns 201 with ok:true and a lead id, and the document is inserted into 'contact_leads' in MongoDB (DB from DB_NAME env). (2) Invalid payloads (missing fullName, invalid email, missing course, empty body) return 400 with an error message and do NOT insert. (3) CRITICAL: Even if Resend email delivery fails (test sender onboarding@resend.dev cannot deliver to arbitrary addresses), the endpoint must still return 201 and the lead must remain saved in MongoDB (verify emailSent flag may be false but ok:true). (4) GET /api/contact returns {ok:true}. Do NOT use curl per instructions is fine to use python requests via base url internal. Base URL is the preview URL /api/contact."
    -agent: "testing"
    -message: "Backend testing complete. All 8 tests passed successfully. Contact API is fully functional with proper validation, MongoDB persistence, and critical Resend failure resilience. The CRITICAL requirement is met: leads are saved to MongoDB even when Resend email delivery fails (confirmationSent=false observed but lead persisted with HTTP 201). No issues found. Backend is production-ready."