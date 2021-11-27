import {useRouter} from "next/router";

export default function () {
    const router = useRouter();
    return (<div>Card {router.query.id}</div>);
}
