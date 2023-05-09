export class SetCreateDto {
  reps: number;
  comment?: string;
  outcome_id: number;

  constructor(data) {
    this.reps = data.reps;
    this.comment = data.comment ?? null;
    this.outcome_id = data.outcome_id;
  }
}
