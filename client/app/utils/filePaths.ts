export function GetPathToProfilePhotoById(id: number|string, tag: string): string {
    return `/assets/telegram/userAssets/${localStorage.getItem(tag)
        }/${id}/profile.jpeg`;
}

const types = ["jpeg", "jpg", "webm", "webp", "ogg", "mp4"];
export function GetPathToMediaFile(
    chatId: number,
    messageId: number,
    type: string,
    tag: string
): string {
    return `/assets/telegram/userAssets/${localStorage.getItem(tag)
        }/${chatId}/${messageId}.${type}`;
}

export async function GetPathToMediaFileWithoutExtension(
    chatId: number,
    messageId: number,
    tag: string
):Promise<string> {
    const promises = types.map(async (type) => {
        const url = `/assets/telegram/userAssets/${localStorage.getItem(tag)
            }/${chatId}/${messageId}.${type}`;
        try {
            const response = await fetch(url);
            if (response.ok) {
                return url;
            }
        } catch { }
        return "";
    });
    var results = await Promise.all(promises);
    var result = results.find((result) => result != "");
    return result ?? "";
}

