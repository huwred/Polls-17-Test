export interface PollQuestion {
    id: number;
    name: string;
    answers: Array<PollAnswer>;
    responses: Array<PollResponse>;
    responsecount: number;
    startdate: null | string;
    enddate: null | string;
    createddate: null | string;
}

export interface PollAnswer {
    id: number;
    value: string;
    index:number;
    questionid:number;
}

export interface PollResponse {
    id:number;
    responsedate: null | string;
    questionid:number;
    answerid:number;
}