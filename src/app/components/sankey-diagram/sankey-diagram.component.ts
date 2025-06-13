/**
 * Sankey Diagram Component
 *
 * @author Anoop
 * @date 2025-06-12
 * @description Interactive Sankey diagram component for visualizing data flow between domains, products, and classifications
 */

import { Component, Input, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
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
  originalCount: number; // Store the original total count
  y: number;
  height: number;
  type: 'domain' | 'product' | 'classification';
  selected: boolean;
  lightIcon?: string;
  darkIcon?: string;
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

  constructor(private cdr: ChangeDetectorRef) {}

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
  mainLineHighlighted: boolean = false;

  /**
   * Angular lifecycle hook - component initialization
   * @author Anoop
   * @date 2025-06-12
   * @description Initializes the component by processing input data and calculating layout positions
   */
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

  /**
   * Gets the appropriate icon URL for a node based on its selection state
   * @author Anoop
   * @date 2025-06-12
   * @description Returns light icon when node is selected, dark icon when unselected
   * @param node - The sankey node to get icon for
   * @returns Icon URL string
   */
  getCurrentIcon(node: SankeyNode): string {
    // Use light icon when selected, dark icon when not selected
    const iconUrl = node.selected ? node.lightIcon : node.darkIcon;
    return this.getValidIconUrl(iconUrl || '');
  }

  /**
   * Checks if a domain name requires text compression due to length
   * @author Anoop
   * @date 2025-06-12
   * @description Identifies specific long domain names that need text compression to prevent overlap
   * @param name - Domain name to check
   * @returns True if domain name is long and needs compression
   */
  isLongDomainName(name: string): boolean {
    // Check if this is one of the specific long domain names that need compression
    return name === 'Agriculture & Environment' || name === 'Population & Demographic';
  }

  handleImageLoad(node: SankeyNode): void {
    console.log('Icon loaded:', {
      node: node.name,
      icon: this.getCurrentIcon(node),
      position: {
        x: node.type === 'domain' ? this.getDomainX() + 10 : this.getProductX() + 10,
        y: node.y + (this.nodeHeight - 20) / 2
      }
    });
  }

  /**
   * Handles icon loading errors
   * @author Anoop
   * @date 2025-06-12
   * @description Logs error details and hides the icon when it fails to load from API
   * @param event - Error event from image loading
   * @param node - The sankey node whose icon failed to load
   */
  handleImageError(event: any, node: SankeyNode): void {
    console.error('Icon failed to load:', {
      node: node.name,
      icon: this.getCurrentIcon(node),
      error: event
    });
    // Hide the icon if it fails to load
    node.lightIcon = '';
    node.darkIcon = '';
  }

  /**
   * Validates and returns icon URL from API data
   * @author Anoop
   * @date 2025-06-12
   * @description Returns the icon URL as provided by API without any fallback modifications
   * @param iconUrl - Icon URL from API data
   * @returns Validated icon URL or empty string
   */
  getValidIconUrl(iconUrl: string): string {
    // Return the icon URL as-is from API data
    return iconUrl || '';
  }

  /**
   * Calculates the Y position for the main trunk line
   * @author Anoop
   * @date 2025-06-12
   * @description Computes the vertical center position of the main trunk based on domain positions
   * @returns Y coordinate for the main trunk line
   */
  getMainTrunkY(): number {
    return (this.domains[0].y + this.domains[this.domains.length - 1].y + this.nodeHeight) / 2;
  }

  /**
   * Generates SVG path for branch connections from trunk to domains
   * @author Anoop
   * @date 2025-06-12
   * @description Creates curved SVG path connecting main trunk to individual domain nodes
   * @param node - Domain node to connect to
   * @returns SVG path string for the branch
   */
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

  /**
   * Generates the main horizontal trunk line SVG path
   * @author Anoop
   * @date 2025-06-12
   * @description Creates the main horizontal line from which all branches originate
   * @returns SVG path string for the main horizontal line
   */
  generateMainHorizontalLine(): string {
    const startX = this.margin.left - 20;
    const mainLineY = (this.domains[0].y + this.domains[this.domains.length - 1].y + this.nodeHeight) / 2;

    return `
      M ${startX} ${mainLineY}
      L ${startX + 40} ${mainLineY}
    `;
  }

  /**
   * Generates the trunk path for the tree structure
   * @author Anoop
   * @date 2025-06-12
   * @description Creates the base trunk line that serves as the starting point for all branches
   * @returns SVG path string for the trunk
   */
  generateTrunkPath(): string {
    const startX = this.margin.left;
    const mainLineY = (this.domains[0].y + this.domains[this.domains.length - 1].y + this.nodeHeight) / 2;
    const controlPoint = 40;

    return `
      M ${startX} ${mainLineY}
      L ${startX + controlPoint} ${mainLineY}
    `;
  }

  /**
   * Generates smooth curved paths for connections between nodes
   * @author Anoop
   * @date 2025-06-12
   * @description Creates smooth curved SVG paths connecting domains to products and products to classifications
   * @param sx - Source X coordinate
   * @param sy - Source Y coordinate
   * @param sh - Source height
   * @param tx - Target X coordinate
   * @param ty - Target Y coordinate
   * @param th - Target height
   * @returns SVG path string for smooth curved connection
   */
  generateSmoothCurvePath(sx: number, sy: number, sh: number, tx: number, ty: number, th: number): string {
    const sourceY = sy + sh / 2;
    const targetY = ty + th / 2;
    const dx = tx - sx;

    // Calculate middle points
    const sourceMidY = (this.domains[0].y + this.domains[this.domains.length - 1].y + this.nodeHeight) / 2;
    const targetMidY = this.products.length > 0 ?
      (this.products[0].y + this.products[this.products.length - 1].y + this.nodeHeight) / 2 :
      sourceMidY;
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
  /**
   * Calculates X position for domain column
   * @author Anoop
   * @date 2025-06-12
   * @description Computes the horizontal position where domain nodes should be placed
   * @returns X coordinate for domain column
   */
  getDomainX(): number {
    return this.margin.left + this.trunkOffset + 80;
  }

  /**
   * Calculates X position for product column
   * @author Anoop
   * @date 2025-06-12
   * @description Computes the horizontal position where product nodes should be placed
   * @returns X coordinate for product column
   */
  getProductX(): number {
    return this.getDomainX() + this.columnWidth + this.columnSpacing;
  }

  /**
   * Calculates X position for classification column
   * @author Anoop
   * @date 2025-06-12
   * @description Computes the horizontal position where classification nodes should be placed
   * @returns X coordinate for classification column
   */
  getClassificationX(): number {
    return this.getProductX() + this.columnWidth + this.columnSpacing;
  }

  /**
   * Processes raw API data into internal node structure
   * @author Anoop
   * @date 2025-06-12
   * @description Transforms API data into domain, product, and classification nodes with proper relationships
   */
  processData(): void {
    const topicPages: Domain[] = this.data?.topic_pages || [];
    if (!topicPages.length) return;

    this.totalCount = this.data?.total_count || 0;

    this.domains = topicPages.map(domain => ({
      id: `domain-${domain.id}`,
      name: domain.name,
      count: domain.count,
      originalCount: domain.count,
      y: 0,
      height: 0,
      type: 'domain',
      selected: false,
      lightIcon: domain.light_icon,
      darkIcon: domain.dark_icon
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
            originalCount: 0,
            y: 0,
            height: 0,
            type: 'product',
            selected: false,
            lightIcon: product.light_icon,
            darkIcon: product.dark_icon
          };
          productMap.set(product.id, productNode);
        }
        productNode.count += product.count;
        productNode.originalCount += product.count;

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
              originalCount: 0,
              y: 0,
              height: 0,
              type: 'classification',
              selected: false
            };
            classificationMap.set(classification.label, classNode);
          }
          classNode.count += classification.count;
          classNode.originalCount += classification.count;

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

  /**
   * Calculates layout positions for all nodes in the diagram
   * @author Anoop
   * @date 2025-06-12
   * @description Computes Y positions for domains, products, and classifications with appropriate spacing
   */
  calculateLayout(): void {
    const verticalPadding = 60;
    // Show all nodes regardless of count, but only connections will be filtered
    const columns = [this.domains, this.products, this.classifications];

    columns.forEach((nodes, columnIndex) => {
      if (nodes.length === 0) return; // Skip empty columns

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

  /**
   * Handles node click events for selection and highlighting
   * @author Anoop
   * @date 2025-06-12
   * @description Manages node selection, highlights related connections, and updates counts for domain filtering
   * @param node - The clicked sankey node
   * @param event - Mouse click event
   */
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
    this.mainLineHighlighted = true;

    if (node.type === 'domain') {
      // Update counts to show only data related to this domain
      this.updateCountsForSelectedDomain(node);

      this.domainToProductLinks.forEach(link => {
        if (link.source.id === node.id) {
          link.highlighted = true;
          // Only select target if it has count > 0
          if (link.target.count > 0) {
            link.target.selected = true;
          }

          this.productToClassificationLinks.forEach(classLink => {
            if (classLink.source.id === link.target.id) {
              classLink.highlighted = true;
              // Only select target if it has count > 0
              if (classLink.target.count > 0) {
                classLink.target.selected = true;
              }
            }
          });
        }
      });
    } else if (node.type === 'product') {
      // Restore original counts when clicking on a product
      this.restoreOriginalCounts();

      this.domainToProductLinks.forEach(link => {
        if (link.target.id === node.id) {
          link.highlighted = true;
          link.source.selected = true;
        }
      });

      this.productToClassificationLinks.forEach(link => {
        if (link.source.id === node.id) {
          link.highlighted = true;
          // Only select target if it has count > 0
          if (link.target.count > 0) {
            link.target.selected = true;
          }
        }
      });
    } else {
      // Restore original counts when clicking on a classification
      this.restoreOriginalCounts();

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

    // Trigger change detection to update icons
    this.cdr.detectChanges();
  }

  /**
   * Clears all node selections and resets the diagram state
   * @author Anoop
   * @date 2025-06-12
   * @description Deselects all nodes, removes highlights, and restores original counts
   */
  clearSelection(): void {
    if (this.selectedNode) {
      [...this.domains, ...this.products, ...this.classifications].forEach(n => {
        n.selected = false;
      });

      this.selectedNode = null;
      this.mainLineHighlighted = false;

      this.domainToProductLinks.forEach(link => link.highlighted = false);
      this.productToClassificationLinks.forEach(link => link.highlighted = false);

      // Restore original counts
      this.restoreOriginalCounts();

      // Trigger change detection to update icons
      this.cdr.detectChanges();
    }
  }

  /**
   * Updates product and classification counts for selected domain filtering
   * @author Anoop
   * @date 2025-06-12
   * @description Recalculates counts to show only data related to the selected domain
   * @param selectedDomain - The domain node that was selected
   */
  private updateCountsForSelectedDomain(selectedDomain: SankeyNode): void {
    // Reset all product and classification counts to 0
    this.products.forEach(product => product.count = 0);
    this.classifications.forEach(classification => classification.count = 0);

    // Find the selected domain in the original data
    const domainId = parseInt(selectedDomain.id.replace('domain-', ''));
    const selectedDomainData = this.data?.topic_pages?.find((domain: any) => domain.id === domainId);

    if (!selectedDomainData) return;

    // Calculate counts for products and classifications based on selected domain only
    selectedDomainData.classifications.forEach((product: any) => {
      // Find the corresponding product node and update its count
      const productNode = this.products.find(p => p.id === `product-${product.id}`);
      if (productNode) {
        productNode.count += product.count;
      }

      // Update classification counts for this product
      product.data_classifications.forEach((classification: any) => {
        const classNode = this.classifications.find(c => c.id === `class-${classification.label}`);
        if (classNode) {
          classNode.count += classification.count;
        }
      });
    });
  }

  /**
   * Restores original counts for all nodes
   * @author Anoop
   * @date 2025-06-12
   * @description Resets all product and classification counts back to their original values
   */
  private restoreOriginalCounts(): void {
    // Restore original counts for all nodes
    [...this.products, ...this.classifications].forEach(node => {
      node.count = node.originalCount;
    });
  }

  /**
   * Checks if any node is currently selected
   * @author Anoop
   * @date 2025-06-12
   * @description Utility method to determine if any node in the diagram is selected
   * @returns True if any node is selected, false otherwise
   */
  anyNodeSelected(): boolean {
    return [...this.domains, ...this.products, ...this.classifications].some(node => node.selected);
  }

  /**
   * Gets filtered products with count > 0
   * @author Anoop
   * @date 2024-12-19
   * @description Returns only products that have a count greater than 0
   * @returns Array of product nodes with count > 0
   */
  getVisibleProducts(): SankeyNode[] {
    return this.products.filter(product => product.count > 0);
  }

  /**
   * Gets filtered classifications with count > 0
   * @author Anoop
   * @date 2024-12-19
   * @description Returns only classifications that have a count greater than 0
   * @returns Array of classification nodes with count > 0
   */
  getVisibleClassifications(): SankeyNode[] {
    return this.classifications.filter(classification => classification.count > 0);
  }
}