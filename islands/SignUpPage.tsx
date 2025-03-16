import { useEffect, useState } from "preact/hooks";
import { hash_256, hash_password } from "../utils/password_hash.ts";
import Button from "../components/Button.tsx";

export default function SignUpPage()
{
    const [loading, setLoading] = useState<boolean>(false);

    function on_sign_up_button_click()
    {
        const username_input = document.querySelector("#username") as HTMLInputElement
        const password_input = document.querySelector("#password") as HTMLInputElement
        const password_repeat_input = document.querySelector("#password-repeat") as HTMLInputElement
        const error_display = document.querySelector("#error-display") as HTMLParagraphElement

        error_display.innerText = "";

        setLoading(false);

        username_input.value = username_input.value.trim()

        if (username_input.value.length < 3)
        {
            error_display.innerText = "Username must be at least 3 characters long"
            return
        }

        if (username_input.value.length > 20)
        {
            error_display.innerText = "Username must be at most 20 characters long"
            return
        }

        if (username_input.value.match(/[^a-zA-Z0-9_]/))
        {
            error_display.innerText = "Username can only contain letters, numbers and underscores"
            return
        }

        if (password_input.value.length < 8)
        {
            error_display.innerText = "Password must be at least 8 characters long"
            return
        }

        if (password_input.value !== password_repeat_input.value)
        {
            error_display.innerText = "Passwords do not match"
            return
        }

        setLoading(true);

        hash_256(password_input.value).then((hashed_password) => {
            fetch(`/api/create_user?username=${username_input.value}&hash=${hashed_password}`).then((response) => {
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
                })
            })
        })
    }

    return (
        <div class="panel">
            <h1>Sign Up</h1>

            <p class="mt-4 text-justify text-gray-300 text-sm">Create an account on Utilify, to create your own tools, that will make your life easier.</p>
            <div class="form-group mt-4">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" class="input" placeholder="cool_guy_12"/>
            </div>

            <div class="form-group mt-4">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" class="input" placeholder="•••••••••••••"/>
            </div>

            <div class="form-group mt-4">
                <label for="password-repeat">Repeat Password</label>
                <input type="password" id="password-repeat" name="password-repeat" class="input" placeholder="•••••••••••••"/>
            </div>

            <p class="text-red-400 my-2" id="error-display"></p>

            {
                loading &&
                <Button text="Creating your account.." fa_icon="spinner" full/>
            }
            {
                !loading &&
                <Button text="Create an account" onClick={on_sign_up_button_click} full/>
            }

            <p class="mt-4 text-justify text-gray-300 text-sm">You already have an account? <a href="/login">Login instead</a>.</p>
        </div>
    )
}