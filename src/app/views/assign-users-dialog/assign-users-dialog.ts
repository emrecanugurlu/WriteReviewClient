import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExpertiseArea } from '../../services/expertise-area/expertise-area';
import { User } from '../../services/user';
import { UsersDto } from '../../dto/users-dto';

export interface AssignUsersDialogData {
  areaId: string;
  areaName: string;
  assignedUserIds: string[];
}

@Component({
  selector: 'app-assign-users-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-users-dialog.html',
})
export class AssignUsersDialog implements OnInit {
  private expertiseAreaService = inject(ExpertiseArea);
  private userService = inject(User);
  private dialogRef = inject(MatDialogRef<AssignUsersDialog>);
  data: AssignUsersDialogData = inject(MAT_DIALOG_DATA);

  users = signal<UsersDto[]>([]);
  assignedIds = signal<Set<string>>(new Set(this.data.assignedUserIds));
  loading = signal(true);
  saving = signal<string | null>(null);
  searchQuery = signal('');
  hasChanges = signal(false);

  filteredUsers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.users();
    return this.users().filter(u =>
      u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  isAssigned(userId: string): boolean {
    return this.assignedIds().has(userId);
  }

  toggle(user: UsersDto) {
    const areaId = this.data.areaId;
    const userId = user.id;
    this.saving.set(userId);

    if (this.isAssigned(userId)) {
      this.expertiseAreaService.removeUserFromArea(areaId, userId).subscribe({
        next: () => {
          this.assignedIds.update(s => { const n = new Set(s); n.delete(userId); return n; });
          this.saving.set(null);
          this.hasChanges.set(true);
        },
        error: () => this.saving.set(null),
      });
    } else {
      this.expertiseAreaService.assignUserToArea(areaId, userId).subscribe({
        next: () => {
          this.assignedIds.update(s => new Set([...s, userId]));
          this.saving.set(null);
          this.hasChanges.set(true);
        },
        error: () => this.saving.set(null),
      });
    }
  }

  close() {
    this.dialogRef.close(this.hasChanges());
  }
}
