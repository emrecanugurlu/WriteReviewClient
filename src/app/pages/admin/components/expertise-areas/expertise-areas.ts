import {Component, inject, signal} from '@angular/core';

import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatDialog} from '@angular/material/dialog';
import {ExpertiseArea} from '../../../../services/expertise-area/expertise-area';
import {ExpertiseAreaWithoutUsersDto} from '../../../../dto/expertise-area-without-users-dto';
import {AddExpertiseAreaDialog} from '../../../../views/add-expertise-area-dialog/add-expertise-area-dialog';


@Component({
  selector: 'app-expertise-areas',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './expertise-areas.html',
  styleUrl: './expertise-areas.scss'
})
export class ExpertiseAreas {
  readonly expertiseAreaService = inject(ExpertiseArea)
  readonly dialog = inject(MatDialog);

  expertiseAreas = signal([<ExpertiseAreaWithoutUsersDto>{}]);
  constructor() {
    this.expertiseAreaService.getAllExpertiseAreaWithoutUsers().subscribe(
      {
        next : (data) => {
          this.expertiseAreas.set(data)
        }
      }
    )
  }

  opeAddDialog(){
    const dialogRef = this.dialog.open(AddExpertiseAreaDialog);
  }
}
