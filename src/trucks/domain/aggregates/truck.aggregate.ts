import { v4 as uuidv4 } from 'uuid';
import { isStatusTransitionAllowed } from './truck-status-transitions';
import { TruckProps } from '../interfaces/truck-props.interface';
import { TruckStatus } from '../enums/truck-status.enum';
import { CreateTruckProps } from '../interfaces/create-truck-props.interface';
import { UpdateTruckProps } from '../interfaces/update-truck-props.interface';
import { InvalidStatusTransitionException } from '../exceptions';

export class Truck {
  private _id: string;
  private _code: string;
  private _name: string;
  private _status: TruckStatus;
  private _description: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: TruckProps) {
    this._id = props.id;
    this._code = props.code;
    this._name = props.name;
    this._status = props.status;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: CreateTruckProps): Truck {
    const now = new Date();
    return new Truck({
      id: uuidv4(),
      code: props.code,
      name: props.name,
      status: props.status ?? TruckStatus.OUT_OF_SERVICE,
      description: props.description ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromProps(props: TruckProps): Truck {
    return new Truck(props);
  }

  update(props: UpdateTruckProps): void {
    if (props.status !== undefined) {
      this.transitionStatus(props.status);
    }
    if (props.code !== undefined) {
      this._code = props.code;
    }
    if (props.name !== undefined) {
      this._name = props.name;
    }
    if (props.description !== undefined) {
      this._description = props.description;
    }
    this._updatedAt = new Date();
  }

  private transitionStatus(newStatus: TruckStatus): void {
    if (!isStatusTransitionAllowed(this._status, newStatus)) {
      throw new InvalidStatusTransitionException(this._status, newStatus);
    }
    this._status = newStatus;
  }

  get id(): string {
    return this._id;
  }
  get code(): string {
    return this._code;
  }
  get name(): string {
    return this._name;
  }
  get status(): TruckStatus {
    return this._status;
  }
  get description(): string | null {
    return this._description;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  toProps(): TruckProps {
    return {
      id: this._id,
      code: this._code,
      name: this._name,
      status: this._status,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
