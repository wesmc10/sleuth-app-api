# Sleuth API

## API Base Endpoint:
* https://mighty-bayou-28648.herokuapp.com/api


## Log In
Sets an authorization token and returns data about a specific user and the jobs the user has applied to

* Route

   /auth/login

* Method

   `POST`

* Data Parameters

   `'user_name': [string]`

   `'password': [string]`

* Successful Response

   **Code:** 200

   **Content:** `{ authToken: [string], dbUser: [object], dbUserJobs: [array] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: Incorrect user name or password }`

   OR

   `{ error: Missing user name or password }`


## Users
Sets an authorization token and posts and returns data about a specific user

* Route

   /users

* Method

   `POST`

* Data Parameters

   `'first_name': [string]`

   `'last_name': [string]`

   `'user_name': [string]`

   `'password': [string]`

* Successful Response

   **Code:** 201

   **Content:** `{ authToken: [string], user: [object] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: The [key] field is required }`

   OR

   `{ error: User name already exists }`

   OR

   `{ Password must be between 8 and 72 characters in length }`

   OR

   `{ Password must not begin or end with empty spaces }`

   OR

   `{ Password must have at least one lowercase and uppercase letter, number, and special character }`


## POST Jobs
Posts and returns data about a specific job

* Route

   /jobs

* Method

   `POST`

* Data Parameters

   `'company': [string]`

   `'position': [string]`

   `'job_location': [string]`

   `'salary': [string]`

   `'date_applied': [date]`

   `'interview_date': [date]`

   `'application_status': [string] (either 'Applied', 'Phone', 'On-site', 'Offer', or 'Rejected')`

   `'notes': [string]`

   `'user_id': [integer]`

* Successful Response

   **Code:** 201

   **Content:** `{ job [object] }`

* Error Response

   **Code:** 400

   **Content:** `{ error: The [key] field is required }`


## GET Jobs
Returns data about a specific job

* Route

   /jobs/:job_id

* Method

   `GET`

* Data Parameters

   None

* Successful Response

   **Code:** 200

   **Content:** `{ job [object] }`

* Error Response

   **Code:** 404

   **Content:** `{ error: Job does not exist }`

   OR

   **Code:** 401

   `{ error: Missing bearer token }`

   OR

   `{ error: Unauthorized request }`


## DELETE Jobs
Deletes a specific job

* Method

   `DELETE`

* Data Parameters

   None

* Successful Response

   **Code:** 204

   **Content:** None

* Error Response

   **Code:** 404

   **Content:** `{ error: Job does not exist }`

   OR

   **Code:** 401

   `{ error: Missing bearer token }`

   OR

   `{ error: Unauthorized request }`


## PATCH Jobs
Updates and returns data about a specific job

* Method

   `PATCH`

* Data Parameters

    **At least one of:**

   `'company': [string]`

   `'position': [string]`

   `'job_location': [string]`

   `'salary': [string]`

   `'date_applied': [date]`

   `'interview_date': [date]`

   `'application_status': [string] (either 'Applied', 'Phone', 'On-site', 'Offer', or 'Rejected')`

* Successful Response

   **Code:** 204

   **Content:** None

* Error Response

   **Code:** 400

   **Content:** `{ error: 'Request body must contain at least one of the required fields' }`

   OR

   **Code:** 404

   **Content:** `{ error: Job does not exist }`

   OR

   **Code:** 401

   `{ error: Missing bearer token }`

   OR

   `{ error: Unauthorized request }`