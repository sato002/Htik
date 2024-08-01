export class Profile {
    public id: number;
    public guidId: string;
    public tdsUsername: string;
    public tdsPassword: string;
    public tdsToken: string;
    public tdsTotalCoin: number;
    public tdsTotalCoinJustEarned: number;
    public tdsCoinJustEarned: number;

    public tikUsername: string;
    public tikPassword: string;
    
    constructor(
        id: number = 0,
        guidId: string = '',
        tdsUsername: string = '',
        tdsPassword: string = '',
        tdsToken: string = '',
        tdsTotalCoin: number = 0,
        tdsTotalCoinJustEarned: number = 0,
        tdsCoinJustEarned: number = 0,
        tikUsername: string = '',
        tikPassword: string = '',
    ) { 
        this.id = id;
        this.guidId = guidId;
        this.tdsUsername = tdsUsername;
        this.tdsPassword = tdsPassword;
        this.tdsToken = tdsToken;
        this.tdsTotalCoin = tdsTotalCoin;
        this.tdsTotalCoinJustEarned = tdsTotalCoinJustEarned;
        this.tdsCoinJustEarned = tdsCoinJustEarned;
        this.tikUsername = tikUsername;
        this.tikPassword = tikPassword;
    }

}