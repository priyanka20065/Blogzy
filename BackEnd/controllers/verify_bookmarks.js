
async function testBookmarks() {
    const baseURL = 'http://localhost:8000/api';
    let token = '';
    let blogId = '';

    try {
        // 1. Signup/Login
        const userCreds = {
            name: 'Test User',
            email: 'test' + Date.now() + '@example.com',
            password: 'password123'
        };

        console.log('Registering/Logging in user...');

        // Try signup first
        const signupRes = await fetch(`${baseURL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userCreds)
        });

        // Login to get token
        const loginRes = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: userCreds.email,
                password: userCreds.password
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login failed: ${loginRes.status}`);
        }

        const loginData = await loginRes.json();
        token = loginData.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        // 2. Get Blogs
        console.log('Fetching blogs...');
        const blogsRes = await fetch(`${baseURL}/blogs`);
        const blogsData = await blogsRes.json();

        if (blogsData.blogs.length === 0) {
            console.log('No blogs found using existing backend data. Please ensure at least one blog exists.');
            return;
        }
        blogId = blogsData.blogs[0]._id;
        console.log('Target Blog ID:', blogId);

        // 3. Toggle Bookmark (Add)
        console.log('Toggling bookmark (Add)...');
        const toggle1 = await fetch(`${baseURL}/user/bookmark/${blogId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const t1Data = await toggle1.json();
        console.log('Response 1:', t1Data.msg);

        if (t1Data.msg !== 'Bookmark added' || !t1Data.bookmarks.includes(blogId)) {
            console.error('FAILED: Bookmark was not added');
            return;
        }

        // 4. Toggle Bookmark (Remove)
        console.log('Toggling bookmark (Remove)...');
        const toggle2 = await fetch(`${baseURL}/user/bookmark/${blogId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const t2Data = await toggle2.json();
        console.log('Response 2:', t2Data.msg);

        if (t2Data.msg !== 'Bookmark removed' || t2Data.bookmarks.includes(blogId)) {
            console.error('FAILED: Bookmark was not removed');
            return;
        }

        console.log('SUCCESS: Bookmark logic verified!');

    } catch (error) {
        console.error('Error:', error.message);
    }
}

testBookmarks();
