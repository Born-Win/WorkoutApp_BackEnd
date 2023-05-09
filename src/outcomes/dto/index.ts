export class OutcomeCreateWithSetsDto {
  weight: string;
  comment?: string;
  sets: {
    reps: number;
    comment?: string;
  }[];
  exercise_id: number;

  constructor(data) {
    this.weight = data.weight;
    this.comment = data.comment;
    this.sets = data.sets;
    this.exercise_id = Number(data.exercise_id);
  }
}

export class OutcomeCreateDto {
  weight: string;
  comment?: string;
  exercise_id: number;

  constructor(data) {
    this.weight = data.weight;
    this.comment = data.comment;
    this.exercise_id = data.exercise_id;
  }
}

export class OutcomeReadDto {
  id: number;
  weight: string;
  comment?: string;

  constructor(data) {
    this.id = data.id;
    this.weight = data.weight;
    this.comment = data.comment;
  }
}

export class OutcomeReadWithSetsDto {
  id: number;
  weight: string;
  comment?: string;
  sets: {
    id: number;
    reps: number;
    comment?: string;
    outcome_id: number;
  }[];

  constructor(data) {
    this.id = data.id;
    this.weight = data.weight;
    this.comment = data.comment;
    this.sets = data.sets;
  }
}
