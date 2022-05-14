import { Transaction } from 'sequelize';
import { Model } from 'sequelize-typescript';
import TransitionError from '../error/transition.error';
import { Transition } from './types/transition';
import { ModelStaticType } from '../types/model-static.type';

export class StateMachine<T extends Model> {
  protected model: ModelStaticType<T> | null = null;
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

  protected beforeTransition(entity: T, transition: Transition, transaction: Transaction): void {}

  protected afterTransition(entity: T, transition: Transition, transaction: Transaction): void {}
}
