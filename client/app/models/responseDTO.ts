export default interface ResponseDTO {
    statusCode: number;
    message: string;
    data: object | null;
}
