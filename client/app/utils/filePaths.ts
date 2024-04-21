export function GetPathToProfilePhotoById(id: number): string {
    return `/assets/telegram/userAssets/${localStorage.getItem("tag")
        }/${id}/profile.jpeg`;
}

const types = ["jpeg", "jpg", "png", "pdf", "docx", "webp", "ogg", "mp4"];
export function GetPathToMediaFile(
    chatId: number,
    messageId: number,
    type: string,
): string {
    return `/assets/telegram/userAssets/${localStorage.getItem("tag")
        }/${chatId}/${messageId}.${type}`;
}

export async function GetPathToMediaFileWithoutExtension(
    chatId: number,
    messageId: number,
) {
    const promises = types.map(async (type) => {
        const url = `/assets/telegram/userAssets/${localStorage.getItem("tag")
            }/${chatId}/${messageId}.${type}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                console.log(url);
                return url;
            }
        }catch {}
    });
    var results = await Promise.all(promises);
    var result = results.find(result => result != undefined);
    return result;
}
