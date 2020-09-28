import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../shared/client.model';
import { FormBuilder, Validators } from '@angular/forms';
import { ClientService } from '../client.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  clients$: Observable<Client[]>;
  filterClients$: Observable<Client[]>;
  displayedColumns = ['name', 'address', 'cnpj_cpf', 'ie', 'operations'];

  // Elemento de referência ao #name no Template
  @ViewChild('name') clientName: ElementRef;

  clientForm = this.fb.group({
    id: [undefined],
    name: ['', [Validators.required]],
    address: ['', [Validators.required]],
    cnpj_cpf: ['', [Validators.required]],
    ie: ['', [Validators.required]],
  });

  constructor(
    public fb: FormBuilder,
    public clientService: ClientService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.clients$ = this.clientService.getClients();
  }

  public onSubmit(): void {
    const c: Client = this.clientForm.value;

    // Ao clicar em Submit, se não tiver ID; else caso tenha o ID
    if (!c.id) {
      this.addClient(c);
    } else {
      this.updateClient(c);
    }
  }

  public addClient(c: Client): void {
    this.clientService.addClient(c)
      .then(() => {
        this.snackBar.open('Cliente Adicionado com Sucesso!', 'OK', {duration: 2000});

        // resetar campos
        this.clientForm.reset({name: '', address: '', cnpj_cpf: '', ie: '', id: undefined});

        // setar foco para o nome do cliente
        this.clientName.nativeElement.focus();
      })
      .catch(() => {
        this.snackBar.open('Erro ao cadastrar o cliente', 'OK', {duration: 2000});
      });
  }

  public updateClient(c: Client): void {
    this.clientService.updateClient(c)
      .then(() => {
        this.snackBar.open('Cliente atualizado com sucesso!', 'OK', {duration: 2000});

        // Atualizando Formulário
        this.clientForm.reset({name: '', address: '', cnpj_cpf: '', ie: '', id: undefined});
        this.clientName.nativeElement.focus();
      })
      .catch((e) => {
        this.snackBar.open('Erro ao atualizar o cliente', 'OK', {duration: 2000});
      });
  }

  public edit(c: Client): void {
    this.clientForm.setValue(c);
  }

  public remove(c: Client): void {
    this.clientService.deleteClient(c)
      .then(() => {
        this.snackBar.open('Cliente Removido com Sucesso!', '', {duration: 2000});
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open('Erro ao excluir o cliente', 'OK', {duration: 2000});
      });
  }

  public filter(event): void {
    // Retornando lista de produtos, através de um Observable
    this.filterClients$ = this.clientService.searchByName(event.target.value);
  }
}
