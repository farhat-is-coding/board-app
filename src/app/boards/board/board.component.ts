import { Component, Input, EventEmitter, Output } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,

} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent {

  // A complete board object
  @Input() board!: { title: string; items: { title: string, color: string }[]; uid: string; };
  // Used to delete the board by returning the uid to parent component
  @Output() returnUID = new EventEmitter<string>();

  @Output() updateLS = new EventEmitter<void>();

  // to create a new item in the current board
  newItemName: string = '';
  newColor: string = 'blue';

  // Modal Opened when adding a new item or updating existing item
  itemModal: HTMLDialogElement | null = null;
  // Check whether the modal is opened for adding a new item or updating existing item
  updateModal: boolean = false;
  // Index of the item to be updated
  updateIndex: number = 0;


  openAddItemModal() {
    this.updateModal = false;
    this.itemModal = document.getElementById(this.board.uid) as HTMLDialogElement;
    this.itemModal.showModal();
  }

  openUpdateItemModal(item: { title: string, color: string }, i: number) {
    // update the values
    this.updateModal = true;
    this.updateIndex = i;
    this.newItemName = item.title;
    this.newColor = item.color;
    // Update Modal
    this.itemModal = document.getElementById(this.board.uid) as HTMLDialogElement;
    this.itemModal.showModal();
  }


  returnDeleteBoardUID() {
    this.returnUID.emit(this.board.uid); // sends value to parent component
  }


  addItem() {
    if (this.newItemName === '') return

    this.board.items.push({
      "title": this.newItemName,
      "color": this.newColor
    })
    // update local storage 
    this.resetDefault();
    this.updateLS.emit();
  }

  updateItem() {
    this.board.items[this.updateIndex] = {
      "title": this.newItemName,
      "color": this.newColor
    }
    this.resetDefault();
    // update local storage 
    this.updateLS.emit();

  }


  deleteItem() {
    this.board.items = this.board.items.filter((item, index) => index !== this.updateIndex);
    this.resetDefault();
    // update local storage 
    this.updateLS.emit();

  }

  resetDefault() {
    setTimeout(() => {
      this.newColor = 'blue';
      this.newItemName = '';
    }, 250);

  }

  drop(event: CdkDragDrop<any>) {
    // if it is the same container then move the item in the array
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateLS.emit();
    }
  }

}
