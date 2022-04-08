import { Transaction } from 'sequelize';
import { Model } from 'sequelize-typescript';
import TransitionError from '../error/transition.error';
import { Transition } from './types/transition';
import { ModelStatic } from '../types/model-static';

export class StateMachine<T extends Model> {
  protected model: ModelStatic<T> | null = null;
  protected stateField = 'state';
  protected transitions: Transition[] = [];

  public async performTransition(entityId: string, transitionName: string, transaction: Transaction): Promise<T> {
    if (!this.model) {
      throw new TransitionError('Model is empty');
    }

    const transition = this.transitions.find((t) => transitionName === t.name);

    if (!transition) {
      throw new TransitionError(`Transition ${transitionName} not found`);
    }

    const entity = await this.model.findByPk(entityId, {
      transaction,
    });

    if (!entity) {
      throw new TransitionError(`Entity with id ${entityId} not found`);
    }

    const currentState = entity.getDataValue(this.stateField);
    if (currentState !== transition.startState) {
      throw new TransitionError(`Cannot perform transition ${transitionName} on state ${currentState}`);
    }

    await this.beforeTransition(entity, transition, transaction);

    const updatedEntity = await entity.update(
      {
        [this.stateField]: transition.endState,
      },
      { transaction },
    );

    await this.afterTransition(updatedEntity, transition, transaction);

    return updatedEntity;
  }

  public async getTransitions(entityId: string, transaction: Transaction): Promise<Transition[]> {
    if (!this.model) {
      throw new TransitionError('Model is empty');
    }

    const entity = await this.model.findByPk(entityId, {
      transaction,
    });

    if (!entity) {
      throw new TransitionError(`Entity with id ${entityId} not found`);
    }

    return this.getTransitionsForState(entity.getDataValue(this.stateField));
  }

  public getTransitionsForState(state: number | string): Transition[] {
    return this.transitions.filter((t) => state === t.startState);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  protected beforeTransition(entity: T, transition: Transition, transaction: Transaction): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  protected afterTransition(entity: T, transition: Transition, transaction: Transaction): void {}
}
