
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const checkBtn = document.getElementById("checkBtn");

const strengthText = document.getElementById("strengthText");
const strengthBar = document.getElementById("strengthBar");
const result = document.getElementById("result");

// Common passwords and predictable patterns
const commonPasswords = [
    "password",
    "password123",
    "12345678",
    "123456789",
    "qwerty123",
    "admin123",
];

// Show / Hide Password
togglePassword.addEventListener("click", function () {

    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "Hide";
    } else {
        password.type = "password";
        togglePassword.textContent = "Show";
    }

});

// Update checklist
function updateCheck(id, passed) {

    const item = document.getElementById(id);

    item.querySelector("span").textContent =
        passed ? "✓" : "✕";

    item.querySelector("span").style.color =
        passed ? "#00e5a8" : "#ff5c70";
}

// Analyze Password

checkBtn.addEventListener("click", function () {

    const value = password.value;

    if (!value) {
        result.textContent = "Please enter a password.";
        strengthText.textContent = "Not checked";
        strengthBar.style.width = "0%";

        ["lengthCheck", "upperCheck", "lowerCheck",
         "numberCheck", "specialCheck"].forEach(id => {
            updateCheck(id, false);
        });

        return;
    }

    const hasLength = value.length >= 12;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[^A-Za-z0-9]/.test(value);

    const isCommon = commonPasswords.includes(
        value.toLowerCase()
    );

    const hasSequence =
        /(?:12345|23456|34567|45678|56789|abcde|bcdef|cdefg|qwerty)/i
        .test(value);

    const hasRepeated =
        /(.)\1{3,}/.test(value);

    updateCheck("lengthCheck", hasLength);
    updateCheck("upperCheck", hasUpper);
    updateCheck("lowerCheck", hasLower);
    updateCheck("numberCheck", hasNumber);
    updateCheck("specialCheck", hasSpecial);

    // Scoring
    let score = 0;

    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (value.length >= 16) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    // Security penalties
    if (isCommon) score = 0;
    else {
        if (hasSequence) score -= 2;
        if (hasRepeated) score -= 1;
    }

    score = Math.max(0, Math.min(score, 6));

    // Strength classification
    let strength;
    let color;

    if (isCommon || score <= 2) {
        strength = "Weak";
        color = "#ff5c70";
    } else if (score <= 4) {
        strength = "Medium";
        color = "#f5b942";
    } else {
        strength = "Strong";
        color = "#00e5a8";
    }

    strengthText.textContent = strength;
    strengthText.style.color = color;

    strengthBar.style.width =
        (score / 6 * 100) + "%";

    strengthBar.style.background = color;

    // Recommendations
    let suggestions = [];

    if (value.length < 12) {
        suggestions.push("Use at least 12 characters.");
    }

    if (!hasUpper || !hasLower) {
        suggestions.push("Consider mixing uppercase and lowercase letters.");
    }

    if (!hasNumber) {
        suggestions.push("Consider adding numbers.");
    }

    if (!hasSpecial) {
        suggestions.push("Consider adding special characters.");
    }

    if (isCommon) {
        suggestions.push("This is a commonly used password. Replace it.");
    }

    if (hasSequence) {
        suggestions.push("Avoid predictable sequences.");
    }

    if (hasRepeated) {
        suggestions.push("Avoid repeating the same character.");
    }

    if (suggestions.length === 0) {
        suggestions.push(
            "No basic weaknesses detected."
        );
    }

    result.textContent = suggestions.join(" ");

});
