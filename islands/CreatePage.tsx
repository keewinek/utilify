import Button from "../components/Button.tsx";
import { useEffect, useState } from "preact/hooks";
import { user } from "../interfaces/user.ts";

export default function CreatePage()
{
    const [loading, setLoading] = useState<boolean>(false);
    const [error, set_error] = useState<string>("");
    
    const user_token = localStorage.getItem("token");
    const user_data_raw = localStorage.getItem("user_data");
    let user_data: user = {username: "", id: "", created_at: 0, token: "", hash: ""};

    useEffect(() => {
        if (user_data_raw == null){
            globalThis.location.href = "/login";
        }
    }, [])


    function on_create_button_click()
    {
        const project_name_input = document.querySelector("#project_name") as HTMLInputElement

        set_error("");

        setLoading(false);

        project_name_input.value = project_name_input.value.trim()

        if (project_name_input.value.match(/[^a-zA-Z0-9 _]/))
        {
            set_error("Project name can only contain letters, numbers and underscores")
            return
        }
        if (project_name_input.value.length < 3)
        {
            set_error("Project name must be at least 3 characters long")
            return
        }
        if (project_name_input.value.length > 50)
        {
            set_error("Project name must be at most 50 characters long")
            return
        }

        setLoading(true);

        fetch(`/api/create_project?username=${project_name_input.value}&token=${user_token}`).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    set_error(data.error)
                    setLoading(false);
                    return
                }

                window.location.href = "/";
            })
        }).catch((error) => {
            set_error("An error occurred while creating your account. Please report this to us.")
            setLoading(false);
        })
}

    return (
        <div class="panel">
            <h1 class="mb-6">Create an Utilify Project</h1>
            <p class="text-justify text-gray-300 text-sm">Create your own tool that will make your life easier in seconds using utilify.js.</p>

            <div class="form-group my-4">
                <label for="project_name">Project name</label>
                <input type="text" id="project_name" name="project_name" class="input" placeholder="My First Project"/>
            </div>

            <Button text="Create" full onClick={on_create_button_click}/>
        </div>
    )
}