export class ScheduleReq {
    end: any;
    start: any;
    title: string;  
    color: string;
}

export class ScheduleResp {
    id: number;
    end: Date;
    start: Date;
    title: string;  
    color: string;
}