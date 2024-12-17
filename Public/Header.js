// JavaScript for handling user actions in the header

document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.querySelector('nav a[href="login.html"]');
    const userIcon = document.querySelector('.user-icon');
    const userInfo = document.querySelector('.user-info');

    // Simulate user login (in real-world, this would be fetched from a server)
    const user = {
        name: 'ผู้ใช้ตัวอย่าง',
        email: 'example@otop.com'
    };

    // Simulate login success
    function loginSuccess() {
        if (loginLink) loginLink.style.display = 'none';
        if (userIcon) userIcon.style.display = 'block';
    }

    // Show user info on click
    if (userIcon) {
        userIcon.addEventListener('click', () => {
            if (userInfo) {
                userInfo.style.display = userInfo.style.display === 'none' || !userInfo.style.display
                    ? 'block'
                    : 'none';
            }
        });
    }

    // Populate user info
    if (userInfo) {
        userInfo.innerHTML = `
            <p><strong>ชื่อ:</strong> ${user.name}</p>
            <p><strong>อีเมล:</strong> ${user.email}</p>
        `;
    }

    // Trigger login success for demo purposes
    loginSuccess();
});
