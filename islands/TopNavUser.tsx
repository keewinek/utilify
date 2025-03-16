import Button from "../components/Button.tsx";
import { user } from "../interfaces/user.ts";

function fetch_and_update_user_data_sync(user_id: string): void {
    const last_update = localStorage.getItem("last_user_data_update");
    if (last_update != null && Date.now() - parseInt(last_update) < 10 * 1000) {
        console.log("User data is up to date");
        return;
    }

    fetch(`/api/get_user?id=${user_id}&token=${localStorage.getItem("token")}`)
    .then((res) => res.json())
    .then((data) => {
        if (data.error == "User not found" || data.error == "Invalid token") {
            console.error(data.error);
            localStorage.removeItem("token");
            localStorage.removeItem("user_data");
        }
        else if (data.error) {
            console.error(data.error);
        }
        else {
            localStorage.setItem("user_data", JSON.stringify(data));
            console.log("User data updated");
        }
    }).finally(() => {
        localStorage.setItem("last_user_data_update", Date.now().toString());
    });
}

export default function TopNavUser()
{
    const user_token = localStorage.getItem("token");
    const user_data_raw = localStorage.getItem("user_data");
    let user_data: user = {username: "", id: "", created_at: 0, token: "", hash: ""};

    if (user_data_raw != null){
        user_data = JSON.parse(user_data_raw) as user;
        fetch_and_update_user_data_sync(user_data.id);
    }
    else {
        localStorage.removeItem("token");
        localStorage.removeItem("user_data");
    }

    function logout()
    {
        localStorage.removeItem("token");
        localStorage.removeItem("user_data");
        window.location.href = "/";
    }

    return (
        <>
            {
                user_token == undefined ?
                    <div class="flex items-center">
                        <a href="/login" class="text-gray-50 mr-4 hover:text-blue-200 hover:no-underline">Login</a>
                        <Button href="/sign_up" text="Sign Up" fa_icon="user" border className="max-md:text-sm" />
                    </div>
                :
                    <div class="flex items-center">
                        <p class="text-gray-50 mr-4 cursor-pointer"><i class="fa-solid fa-user mr-2"></i>{user_data.username}</p>

                        <div class="relative " onClick={(e) => e.stopPropagation()}>
                            <button class="text-gray-50 hover:text-blue-200 focus:outline-none w-3" onClick={
                                (e) => {
                                    const dropdown = e.currentTarget.nextElementSibling;
                                    if (dropdown == null) return;
                                    dropdown.classList.toggle("hidden");
                                }
                            }>
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <div class="absolute dropdown right-0 mt-2 w-48 max-w-screen bg-black rounded-md shadow-lg py-1 z-20 hidden">
                                <a href="/add" class="block px-4 py-2 text-gray-50 hover:bg-gray-950 hover:no-underline"><i class="fa-solid fa-plus mr-2"></i>Add Server</a>
                                <a href="/your_servers" class="block px-4 py-2 text-gray-50 hover:bg-gray-950 hover:no-underline"><i class="fa-solid fa-server mr-2"></i>Your Servers</a>
                                <a href="/account_settings" class="block px-4 py-2 text-gray-50 hover:bg-gray-950 hover:no-underline"><i class="fa-solid fa-gear mr-2"></i>Account Settings</a>
                                <a href="#" onClick={logout} class="block px-4 py-2 text-gray-50 hover:bg-red-950 hover:no-underline"><i class="fa-solid fa-right-from-bracket mr-2"></i>Logout</a>
                            </div>
                        </div>
                        <script>
                            {`
                                document.addEventListener('click', function(event) {
                                    const dropdowns = document.querySelectorAll('.dropdown');
                                    dropdowns.forEach(dropdown => {
                                        if (!dropdown.classList.contains('hidden') && !dropdown.parentElement.contains(event.target)) {
                                            dropdown.classList.add('hidden');
                                        }
                                    });
                                });
                            `}
                        </script>
                    </div>
            }
        </>
    )
}