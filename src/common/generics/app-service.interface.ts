import { Either } from './either';

export interface AppServiceI<P, L, R> {
  execute(param: P): Promise<Either<L, R>>;
}
