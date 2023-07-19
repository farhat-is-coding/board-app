import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { v4 as uuidv4 } from 'uuid';


interface BoardItem {
  title: string;
  color: string;
}

interface Board {
  title: string;
  items: BoardItem[];
  uid: string;
}

@Component({
  selector: 'app-boards',
  templateUrl: './boards.component.html',
  styleUrls: ['./boards.component.css']
})
export class BoardsComponent {

  newBoardName: string = '';
  receivedUID!: string;
  confirmationModal: HTMLDialogElement | null = null;

  boards: Board[] = JSON.parse(localStorage.getItem('boards')!) || [
    { title: 'Welcome', items: [{ title: 'Howdyyyy', color: 'blue' }], uid: uuidv4() },
  ];

  createBoard() {
    // if (this.boards.length === 4) return
    if (this.newBoardName === '') return
    this.boards.push({
      title: this.newBoardName,
      items: [
        { title: 'hello', color: "blue" },
      ],
      uid: uuidv4()
    })
    // can you reset default after some delay? generate the code


    this.resetDefault();
    this.updateLocalStorage();
  }

  uidToDeleteTheBoard(value: string) {
    this.receivedUID = value;
    // Check for popup
    this.confirmationModal = document.getElementById('delete-board') as HTMLDialogElement;
    this.confirmationModal.showModal();
  }
  removeBoard() {
    this.boards = this.boards.filter((board) => board.uid !== this.receivedUID)
    this.updateLocalStorage();
  }

  drop(event: CdkDragDrop<any>) {
    // if it is the same container then move the item in the array
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateLocalStorage();
    }
  }

  updateLocalStorage() {
    if (this.boards.length === 0) {
      localStorage.removeItem('boards');
      return;
    }
    localStorage.setItem('boards', JSON.stringify(this.boards));
  }

  resetDefault() {
    setTimeout(() => {
      this.newBoardName = '';

    },250);
  }

}
