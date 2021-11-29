import {useRouter} from "next/router";
import Card from "../../features/card/Card";

export default function () {
    const router = useRouter();
    return (<Card id={router.query.id as string}/>);
}
