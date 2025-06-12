import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DataClassification {
  name: string;
  id: number | null;
  label: string;
  count: number;
}

interface Product {
  id: number;
  key: string;
  name: string;
  light_icon: string;
  dark_icon: string;
  count: number;
  data_classifications: DataClassification[];
}

interface Domain {
  id: number;
  name: string;
  light_icon: string;
  dark_icon: string;
  count: number;
  classifications: Product[];
}

interface SankeyNode {
  id: string;
  name: string;
  count: number;
  y: number;
  height: number;
  type: 'domain' | 'product' | 'classification';
  selected: boolean;
  icon?: string;
}

interface SankeyLink {
  source: SankeyNode;
  target: SankeyNode;
  value: number;
  highlighted: boolean;
}

@Component({
  selector: 'app-sankey-diagram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sankey-diagram.component.html',
  styleUrls: ['./sankey-diagram.component.scss']
})
export class SankeyDiagramComponent implements OnInit {
  @Input() data: any;
  @Input() baseUrl: string = '';

  width = 1400;
  height = 700;
  columnWidth = 220;
  columnSpacing = 120;
  nodeHeight = 45;
  margin = { top: 40, left: 160 };
  trunkOffset = 30;
  radius = 80;
  totalCount: number = 0;

  domains: SankeyNode[] = [];
  products: SankeyNode[] = [];
  classifications: SankeyNode[] = [];
  domainToProductLinks: SankeyLink[] = [];
  productToClassificationLinks: SankeyLink[] = [];
  selectedNode: SankeyNode | null = null;

  ngOnInit(): void {
    this.processData();
    this.calculateLayout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const svg = event.target as Element;
    if (!svg.closest('svg')) {
      this.clearSelection();
    }
  }

  handleImageLoad(node: SankeyNode): void {
    console.log('Icon loaded:', {
      node: node.name,
      icon: node.icon,
      position: {
        x: node.type === 'domain' ? this.getDomainX() + 10 : this.getProductX() + 10,
        y: node.y + (this.nodeHeight - 20) / 2
      }
    });
  }

  handleImageError(event: any, node: SankeyNode): void {
    console.error('Icon failed to load:', {
      node: node.name,
      icon: node.icon,
      error: event
    });
    node.icon = 'https://cdn-icons-png.flaticon.com/512/1828/1828640.png';
  }

  getMainTrunkY(): number {
    return (this.domains[0].y + this.domains[this.domains.length - 1].y + this.nodeHeight) / 2;
  }


generateBranchPath(node: SankeyNode): string {
  const startX = this.margin.left - 20;
  const endX = this.getDomainX();
  const y = node.y + this.nodeHeight / 2;
  const mainLineY = (this.domains[0].y + this.domains[this.domains.length - 1].y + this.nodeHeight) / 2;
  const branchPoint = startX + 40; // Point where branches start

  // Create curved path from the branch point
  return `
    M ${branchPoint} ${mainLineY}
    C ${branchPoint + 30} ${mainLineY}
      ${branchPoint + 30} ${y}
      ${endX} ${y}
  `;
}

// Add this method to generate the main horizontal line
generateMainHorizontalLine(): string {
  const startX = this.margin.left - 20;
  const mainLineY = (this.domains[0].y + this.domains[this.domains.length - 1].y + this.nodeHeight) / 2;
  
  return `
    M ${startX} ${mainLineY}
    L ${startX + 40} ${mainLineY}
  `;
}

// Add this method to your component
generateTrunkPath(): string {
  const startX = this.margin.left;
  const mainLineY = (this.domains[0].y + this.domains[this.domains.length - 1].y + this.nodeHeight) / 2;
  const controlPoint = 40;

  return `
    M ${startX} ${mainLineY}
    L ${startX + controlPoint} ${mainLineY}
  `;
}

generateSmoothCurvePath(sx: number, sy: number, sh: number, tx: number, ty: number, th: number): string {
  const sourceY = sy + sh / 2;
  const targetY = ty + th / 2;
  const dx = tx - sx;
  
  // Calculate middle points
  const sourceMidY = (this.domains[0].y + this.domains[this.domains.length - 1].y + this.nodeHeight) / 2;
  const targetMidY = (this.products[0].y + this.products[this.products.length - 1].y + this.nodeHeight) / 2;
  const midX = sx + dx/2;

  // For domain to product connections
  if (sx < tx && Math.abs(sx - this.getDomainX()) < 10) {
    const connectionPoint = this.getDomainX() + this.columnWidth + 40;
    
    return `
      M ${sx} ${sourceY}
      C ${sx + 50} ${sourceY} 
        ${connectionPoint - 50} ${sourceMidY} 
        ${connectionPoint} ${sourceMidY}
      L ${connectionPoint + 20} ${sourceMidY}
      C ${connectionPoint + 70} ${sourceMidY} 
        ${tx - 50} ${targetY} 
        ${tx} ${targetY}
    `;
  }
  
  // For product to classification connections
  return `
    M ${sx} ${sourceY}
    C ${sx + 50} ${sourceY} 
      ${midX - 50} ${targetMidY} 
      ${midX} ${targetMidY}
    C ${midX + 50} ${targetMidY} 
      ${tx - 50} ${targetY} 
      ${tx} ${targetY}
  `;
}
  getDomainX(): number {
    return this.margin.left + this.trunkOffset + 80;
  }

  getProductX(): number {
    return this.getDomainX() + this.columnWidth + this.columnSpacing;
  }

  getClassificationX(): number {
    return this.getProductX() + this.columnWidth + this.columnSpacing;
  }

  processData(): void {
    const topicPages: Domain[] = this.data?.topic_pages || [];
    if (!topicPages.length) return;

    this.totalCount = this.data?.total_count || 0;

    this.domains = topicPages.map(domain => ({
      id: `domain-${domain.id}`,
      name: domain.name,
      count: domain.count,
      y: 0,
      height: 0,
      type: 'domain',
      selected: false,
      icon: domain.light_icon
    }));

    const productMap = new Map<number, SankeyNode>();
    const classificationMap = new Map<string, SankeyNode>();

    topicPages.forEach(domain => {
      domain.classifications.forEach(product => {
        let productNode = productMap.get(product.id);
        if (!productNode) {
          productNode = {
            id: `product-${product.id}`,
            name: product.name,
            count: 0,
            y: 0,
            height: 0,
            type: 'product',
            selected: false,
            icon: product.light_icon
          };
          productMap.set(product.id, productNode);
        }
        productNode.count += product.count;

        this.domainToProductLinks.push({
          source: this.domains.find(d => d.name === domain.name)!,
          target: productNode,
          value: product.count,
          highlighted: false
        });

        product.data_classifications.forEach(classification => {
          let classNode = classificationMap.get(classification.label);
          if (!classNode) {
            classNode = {
              id: `class-${classification.label}`,
              name: classification.label,
              count: 0,
              y: 0,
              height: 0,
              type: 'classification',
              selected: false
            };
            classificationMap.set(classification.label, classNode);
          }
          classNode.count += classification.count;

          this.productToClassificationLinks.push({
            source: productNode,
            target: classNode,
            value: classification.count,
            highlighted: false
          });
        });
      });
    });

    this.products = Array.from(productMap.values());
    this.classifications = Array.from(classificationMap.values());
  }

 calculateLayout(): void {
  const verticalPadding = 60;
  const columns = [this.domains, this.products, this.classifications];
  
  columns.forEach((nodes, columnIndex) => {
    const totalHeight = nodes.length * this.nodeHeight;
    let spacing: number;
    
    if (columnIndex === 1 || columnIndex === 2) { // Products and Classifications columns
      spacing = 20; // Smaller spacing for products and classifications
      const totalColumnHeight = totalHeight + (nodes.length - 1) * spacing;
      let y = (this.height - totalColumnHeight) / 2; // Center the nodes
      
      nodes.forEach(node => {
        node.y = y;
        node.height = this.nodeHeight;
        y += this.nodeHeight + spacing;
      });
    } else { // Domains column
      spacing = (this.height - totalHeight - (2 * verticalPadding)) / (nodes.length - 1);
      let y = verticalPadding;
      
      nodes.forEach(node => {
        node.y = y;
        node.height = this.nodeHeight;
        y += this.nodeHeight + spacing;
      });
    }
  });
}

  onNodeClick(node: SankeyNode, event: MouseEvent): void {
    event.stopPropagation();
    
    if (this.selectedNode === node) {
      this.clearSelection();
      return;
    }

    [...this.domains, ...this.products, ...this.classifications].forEach(n => {
      n.selected = false;
    });
    
    this.domainToProductLinks.forEach(link => link.highlighted = false);
    this.productToClassificationLinks.forEach(link => link.highlighted = false);
    
    node.selected = true;
    this.selectedNode = node;

    if (node.type === 'domain') {
      this.domainToProductLinks.forEach(link => {
        if (link.source.id === node.id) {
          link.highlighted = true;
          link.target.selected = true;
          
          this.productToClassificationLinks.forEach(classLink => {
            if (classLink.source.id === link.target.id) {
              classLink.highlighted = true;
              classLink.target.selected = true;
            }
          });
        }
      });
    } else if (node.type === 'product') {
      this.domainToProductLinks.forEach(link => {
        if (link.target.id === node.id) {
          link.highlighted = true;
          link.source.selected = true;
        }
      });
      
      this.productToClassificationLinks.forEach(link => {
        if (link.source.id === node.id) {
          link.highlighted = true;
          link.target.selected = true;
        }
      });
    } else {
      this.productToClassificationLinks.forEach(link => {
        if (link.target.id === node.id) {
          link.highlighted = true;
          link.source.selected = true;
          
          this.domainToProductLinks.forEach(domainLink => {
            if (domainLink.target.id === link.source.id) {
              domainLink.highlighted = true;
              domainLink.source.selected = true;
            }
          });
        }
      });
    }
  }

  clearSelection(): void {
    if (this.selectedNode) {
      [...this.domains, ...this.products, ...this.classifications].forEach(n => {
        n.selected = false;
      });
      
      this.selectedNode = null;
      
      this.domainToProductLinks.forEach(link => link.highlighted = false);
      this.productToClassificationLinks.forEach(link => link.highlighted = false);
    }
  }

  anyNodeSelected(): boolean {
    return [...this.domains, ...this.products, ...this.classifications].some(node => node.selected);
  }
}