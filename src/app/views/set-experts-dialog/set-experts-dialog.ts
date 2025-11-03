import {Component, inject, model, signal, WritableSignal} from '@angular/core';
import {MatFormField} from '@angular/material/form-field';
import {MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {MatCheckbox} from '@angular/material/checkbox';
import {MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {ExpertiseArea} from '../../services/expertise-area/expertise-area';
import {ExpertiseAreaWithUsersDto} from '../../dto/expertise-area-with-users-dto';
import {Expert} from '../../services/expert';
import {AddArticleExpertDTO} from '../../dto/add-article-expert-dto';

@Component({
  selector: 'app-set-experts-dialog',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatCheckbox,
    MatOption,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatInput
  ],
  templateUrl: './set-experts-dialog.html',
  styleUrl: './set-experts-dialog.scss'
})
export default class SetExpertsDialog {
  expertiseAreaService = inject(ExpertiseArea)
  expertService = inject(Expert);
  dialogRef = inject(MatDialogRef<SetExpertsDialog>);

  isSelectExpert = signal(false);


  expertiseAreas:WritableSignal<ExpertiseAreaWithUsersDto[]> = signal([]);
  selectedExpertiseName: WritableSignal<string> = signal("");
  readonly data = inject(MAT_DIALOG_DATA);
  readonly articleId = model(this.data.articleId);


  constructor() {
    this.expertiseAreaService.getAllExpertiseAreaWithUsers().subscribe(
      {
        next: (res) => {
          this.expertiseAreas.set(res)
        },
        error: _ =>{
          console.log(_);
        }
      }
    )
  }

  setCategory(event: MatSelectChange){
    this.selectedExpertiseName.set(event.value);
  }

  setIsSelectExpert(){
    this.isSelectExpert.update(value => !value)
  }

  addArticleExpert(){
    this.expertService.addArticleExpert({articleId:this.articleId(),expertId:""})
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
