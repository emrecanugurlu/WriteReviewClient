import {ExpertiseAreaUserDto} from './expertise-area-user-dto';

export type ExpertiseAreaWithUsersDto = {
  id: string
  name: string
  users : ExpertiseAreaUserDto[]
}
