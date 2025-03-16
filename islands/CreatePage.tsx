import Button from "../components/Button.tsx";
import { useEffect, useState } from "preact/hooks";
import { user } from "../interfaces/user.ts";

export default function CreatePage()
{
    const [loading, setLoading] = useState<boolean>(false);
    const [error, set_error] = useState<string>("");
    const [desc_words, set_desc_words] = useState<number>(0);
    
    const user_token = localStorage.getItem("token");
    const user_data_raw = localStorage.getItem("user_data");

    useEffect(() => {
        if (user_data_raw == null){
            globalThis.location.href = "/login";
        }
    }, [])


    function on_create_button_click()
    {
        const project_name_input = document.querySelector("#project_name") as HTMLInputElement
        const project_description_input = document.querySelector("#project_description") as HTMLInputElement

        set_error("");

        setLoading(false);

        project_name_input.value = project_name_input.value.trim()
        project_description_input.value = project_description_input.value.trim()

        if (project_name_input.value.match(/[^a-zA-Z0-9 _]/)) {
            set_error("Project name can only contain letters, numbers, spaces and underscores")
            return
        }
        if (project_name_input.value.length < 3) {
            set_error("Project name must be at least 3 characters long")
            return
        }
        if (project_name_input.value.length > 50) {
            set_error("Project name must be at most 50 characters long")
            return
        }

        if (project_description_input.value.split(" ").length < 50 || project_description_input.value.split(" ").length > 300) {
            set_error("Your project description need to have 50-300 words.")
            return
        }
        if (project_description_input.value.length > 3000) {
            set_error("Your project description can't be longer than 3000 characters.")
            return
        }

        setLoading(true);

        fetch(`/api/create_project?project_name=${project_name_input.value}&project_description=${project_description_input.value}&token=${user_token}`).then((response) => {
            response.json().then((data) => {
                if (data.error) {
                    set_error(data.error)
                    setLoading(false);
                    return
                }

                globalThis.location.href = `/project/${data.id}/edit`
            })
        }).catch((error) => {
            set_error("An error occurred while creating your project. Please report this to us.")
            setLoading(false);
        })
}

    return (
        <div class="panel">
            <h1 class="mb-6">Create Project</h1>
            <p class="text-sm">Create your own tool that will make your life easier in seconds using utilify.js.</p>

            <div class="form-group my-4">
                <label for="project_name">Project name</label>
                <input type="text" id="project_name" name="project_name" class="input" placeholder="My First Project"/>
            </div>

            <div class="form-group mt-4">
                <label for="project_description">Project description {desc_words}/50 words</label>
                <textarea 
                    type="text" id="project_description" name="project_description" class="input h-52" 
                    placeholder="Your description needs to describe your tool accurately. Tell people about what it will do, and how it can make their life easier."
                    onInput={(e) => {
                        const words = e.currentTarget.value.split(" ").length
                        set_desc_words(words)
                    }}
                />
            </div>

            <p class="text-sm text-gray-300">You can change the description later. Using AI, content copied from other websites or spamming will result in a ban.</p>

            <p class="text-red-400 my-2">{error}</p>

            <Button text="Create" full className="my-4" onClick={on_create_button_click}/>
        </div>
    )
}