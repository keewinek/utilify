import AccountSettingPage from '../islands/AccountSettingsPage.tsx';

export default function AccountSettingsPageWrapper()
{
    return (
        <>
            <head>
                <title>Account Settings | Utilify</title>
            </head>
            <body class="bg-grid bg-gray-1000">
                <AccountSettingPage/>
            </body>
        </>
    )
}