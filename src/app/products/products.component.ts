import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../product.service';
import { Product } from '../shared/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products$: Observable<Product[]>;
  filterProducts$: Observable<Product[]>;
  displayedColumns = ['name', 'price', 'stock', 'operations'];

  // Elemento de referência ao #name no Template
  @ViewChild('name') productName: ElementRef;

  productForm = this.fb.group({
    id:    [undefined],
    name:  ['', [Validators.required]],
    stock: [0, [Validators.required]],
    price: [0, [Validators.required]],
  });

  constructor(
    public fb: FormBuilder,
    public productService: ProductService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }

  public onSubmit(): void {
    const p: Product = this.productForm.value;

    // Ao clicar em Submit, se não tiver ID; else caso tenha o ID
    if (!p.id) {
      this.addProduct(p);
    } else {
      this.updateProduct(p);
    }
  }

  public addProduct(p: Product): void {
    this.productService.addProduct(p)
      .then(() => {
        this.snackBar.open('Produto Adicionado com Sucesso!', 'OK', {duration: 2000});

        // resetar campos
        this.productForm.reset({name: '', stock: 0, price: 0, id: undefined});

        // setar foco para o nome do produto
        this.productName.nativeElement.focus();
      })
      .catch(() => {
        this.snackBar.open('Erro em adicionar o produto', 'OK', {duration: 2000});
      });
  }

  public updateProduct(p: Product): void {
    this.productService.updateProduct(p)
      .then(() => {
        this.snackBar.open('Produto Atualizado com Sucesso!', 'OK', {duration: 2000});

        // Atualizando Formulário
        this.productForm.reset({name: '', stock: 0, price: 0, id: undefined});
        this.productName.nativeElement.focus();
      })
      .catch((e) => {
        this.snackBar.open('Erro ao atualizar o produto', 'OK', {duration: 2000});
      });
  }

  public edit(p: Product): void {
    this.productForm.setValue(p);
  }

  public remove(p: Product): void {
    this.productService.deleteProduct(p)
      .then(() => {
        this.snackBar.open('Produto Removido com Sucesso!', 'OK', {duration: 2000});
      })
      .catch((e) => {
        console.log(e);
        this.snackBar.open('Erro ao remover o produto', 'OK', { duration: 2000 });
      });
  }

  public filter(event): void {
    // Retornando lista de produtos, através de um Observable
    this.filterProducts$ = this.productService.searchByName(event.target.value);
  }

}
