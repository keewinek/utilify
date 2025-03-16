import Button from "../components/Button.tsx";
import { hash_256, hash_password } from "../utils/password_hash.ts";
import { useEffect, useState } from "preact/hooks";

export default function LoginPage()
{
    const [loading, setLoading] = useState<boolean>(false);
    
    function on_login_button_click()
    {
        const username_input = document.querySelector("#username") as HTMLInputElement
        const password_input = document.querySelector("#password") as HTMLInputElement
        const error_display = document.querySelector("#error-display") as HTMLParagraphElement

        error_display.innerText = "";

        setLoading(false);

        username_input.value = username_input.value.trim()

        if (username_input.value.length < 3)
        {
            error_display.innerText = "Username must be at least 3 characters long"
            return
        }

        if (username_input.value.match(/[^a-zA-Z0-9_]/))
        {
            error_display.innerText = "Username can only contain letters, numbers and underscores"
            return
        }

        setLoading(true);

        hash_256(password_input.value).then((hashed_password) => {
            fetch(`/api/login?username=${username_input.value}&hash=${hashed_password}`).then((response) => {
                response.json().then((data) => {
                    if (data.error)
                    {
                        error_display.innerText = data.error
                        setLoading(false);
                        return
                    }

                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user_data", JSON.stringify(data));
                    window.location.href = "/";
                }).catch((error) => {
                    error_display.innerText = "An error occurred while creating your account. Please report this to us."
                    setLoading(false);
                })
            })
        })
    }

    return (
        <div class="panel">
            <h1>Login</h1>
            <div class="inner-panel mt-6">
                <p class="mt-4 text-justify text-gray-300 text-sm">Login to Utilify, to create your own tools!</p>
                <div class="form-group mt-4">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" class="input" placeholder="cool_guy_12"/>
                </div>

                <div class="form-group mt-4">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" class="input" placeholder="•••••••••••••"/>
                </div>

                <p class="text-red-400 my-2" id="error-display"></p>

                {
                    loading &&
                    <Button text="Logging you in.." fa_icon="spinner animate-spin" full/>
                }
                {
                    !loading &&
                    <Button text="Login" full onClick={on_login_button_click}/>
                }

                <p class="mt-4 text-justify text-gray-300 text-sm">Don't have an account? <a href="/sign_up">Create an account instead</a>.</p>
            </div>
        </div>
    )
}