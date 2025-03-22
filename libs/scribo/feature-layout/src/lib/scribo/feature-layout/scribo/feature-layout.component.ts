import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'scrb-layout-main',
  imports: [CommonModule, RouterModule],
  templateUrl: './feature-layout.component.html',
  styleUrl: './feature-layout.component.scss',
})
export class ScriboFeatureLayoutComponent {}
