USE exped360_db;

SELECT id, title
FROM blog_posts
WHERE title LIKE '%immobili%'
   OR title LIKE '%’%'
   OR title LIKE '%??%'
LIMIT 50;
