export default function Timestamp({time, className}: TimestampProps) {
    return <p className={className}>{formatDate(time)}</p>;
}

function formatDate(value: string): string {
    let date = new Date(value);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

interface TimestampProps {
    time: string;
    className: string;
}
