export function GetPathToProfilePhotoById(id: number):string {
    return `/assets/telegram/userAssets/${localStorage.getItem("tag")}/${id}/profile.jpeg`
}
