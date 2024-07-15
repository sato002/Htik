export class AccountService {
    getAccounts() {
        return fetch('demo/data/accounts.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    }
}