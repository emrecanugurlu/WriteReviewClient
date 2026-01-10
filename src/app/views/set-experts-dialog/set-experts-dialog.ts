import {Component, inject, model, OnInit, signal, WritableSignal} from '@angular/core';
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
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

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
    MatInput,
    ReactiveFormsModule
  ],
  templateUrl: './set-experts-dialog.html',
  styleUrl: './set-experts-dialog.scss'
})
export default class SetExpertsDialog implements OnInit {
  expertiseAreaService = inject(ExpertiseArea)
  expertService = inject(Expert);
  dialogRef = inject(MatDialogRef<SetExpertsDialog>);

  isSelectExpert = signal(false);

  form!: FormGroup;
  fb = inject(FormBuilder);


  expertiseAreas:WritableSignal<ExpertiseAreaWithUsersDto[]> = signal([]);
  selectedExpertiseName: WritableSignal<string> = signal("");
  readonly data = inject(MAT_DIALOG_DATA);
  readonly articleId = model(this.data.articleId);


  constructor() {
    this.form = this.fb.group({
      expertiseAreas: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.expertiseAreaService.getAllExpertiseAreaWithUsers().subscribe(
      {
        next: (res) => {
          this.expertiseAreas.set(res)
          this.buildForm(this.expertiseAreas())
        },
        error: _ =>{
          console.log(_);
        }
      }
    )

    }

  private buildForm(areas: ExpertiseAreaWithUsersDto[]): void {
    const areaFormGroups = areas.map(area =>
      this.fb.group({
        areaId: this.fb.control(""),
        users: this.fb.array(area.users.map(() => this.fb.control(false)))
      })
    );

    const expertiseAreasArray = this.fb.array(areaFormGroups);
    this.form.setControl('expertiseAreas', expertiseAreasArray);

  }

  get expertiseAreasFormArray(): FormArray {
    return this.form.get('expertiseAreas') as FormArray;
  }

  getUsersFormArray(areaIndex: number): FormArray {
    return (this.expertiseAreasFormArray.at(areaIndex) as FormGroup).get('users') as FormArray;
  }

  getSelectedPairs(): { expertiseAreaId: string; userId: string }[] {
    const result: { expertiseAreaId: string; userId: string }[] = [];
    const areas = this.expertiseAreas();

    this.expertiseAreasFormArray.controls.forEach((areaGroup, areaIndex) => {
      const usersArray = (areaGroup as FormGroup).get('users') as FormArray;

      usersArray.controls.forEach((control, userIndex) => {
        if (control.value) {
          const area = areas[areaIndex];
          const eaUser = area.users[userIndex];

          result.push({
            expertiseAreaId: this.articleId(),
            userId: eaUser.id
          });
        }
      });
    });

    return result;
  }

  setCategory(event: MatSelectChange){
    this.selectedExpertiseName.set(event.value);
  }

  setIsSelectExpert(){
    this.isSelectExpert.update(value => !value)
  }

  addArticleExpert(){
    const selectedPairs = this.getSelectedPairs();
    const data = selectedPairs.map(pair => {
      return {articleId: pair.expertiseAreaId, expertId: pair.userId};
    })


    this.expertService.addArticleExperts(data).subscribe({
      next: (res) => {
        console.log(res)
      },
      error: _ =>{

      }
    })
    console.log('Seçilenler (areaId + userId):', selectedPairs);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
