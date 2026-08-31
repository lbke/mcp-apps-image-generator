// Clean client-side fetch function
// @see https://react.dev/learn/you-might-not-need-an-effect#fetching-data
import { useEffect, useState } from "react";

export function useData(skip: boolean, url: string, options: any) {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        if (skip) return
        let ignore = false;
        fetch(url, options)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw new Error(`Fetch error: ${response.statusText} ${response.status}`)
            })
            .then(json => {
                if (!ignore) {
                    setData(json);
                }
            })
            .catch(err => { setError(err) });
        return () => {
            ignore = true;
        };
    }, [url, skip]);
    return [data, error];
}