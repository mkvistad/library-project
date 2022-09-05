export default function DeleteAccount() {
    function deleteButton() {
        fetch("/api/delete-account", {
            method: "POST",
        }).then((response) => {
            if (response.ok) {
                location.replace("/goodbye");
            }
        });
    }
    return <button onClick={deleteButton}>Delete Account</button>;
}
