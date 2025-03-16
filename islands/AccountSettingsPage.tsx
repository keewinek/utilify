import Button from "../components/Button.tsx";
import { user } from "../interfaces/user.ts";

export default function AccountSettingsPage()
{
    const user_data_raw = localStorage.getItem("user_data");
    const user_token = localStorage.getItem("token");

    let user_data = {username: "", id: "", created_at: 0, token: "", hash: ""} as user;

    if (user_data_raw != null) {
        user_data = JSON.parse(user_data_raw);
    }

    function delete_account()
    {
        fetch(`/api/delete_user?id=${user_data.id}&token=${user_token}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                document.getElementById("delete-error")!.innerText = data.error;
                console.error(data.error);
            }
            else {
                localStorage.removeItem("token");
                localStorage.removeItem("user_data");
                window.location.href = "/";
            }
        });
    }

    return (
        <div class="panel">
            <h1>Account settings</h1>
            <h2 class="mt-6">Delete your account</h2>
            <p class="my-4">Deleting your account will remove all of your data from Utilify. Also you wont have access you your tools. We recommend deleting your tools first. This action is irreversible.</p>
            <p class="text-red-300 my-2" id="delete-error"></p>
            <Button text="Delete account" onClick={delete_account} className="bg-red-400 hover:bg-red-500" fa_icon="trash" full/>
        </div>
    )
}