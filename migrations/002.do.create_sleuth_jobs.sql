CREATE TYPE app_status AS ENUM ('Applied', 'Phone', 'On-site', 'Offer', 'Rejected');

CREATE TABLE sleuth_jobs (
    id int PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    company varchar NOT NULL,
    position varchar NOT NULL,
    job_location varchar NOT NULL,
    salary varchar(10),
    date_applied date NOT NULL,
    interview_date date,
    application_status app_status,
    notes text,
    user_id int REFERENCES sleuth_users(id) ON DELETE CASCADE NOT NULL
);