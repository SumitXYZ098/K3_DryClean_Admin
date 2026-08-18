import type React from "react";
import { useState } from "react";
import useServicesHook from "../../hooks/useServicesHook";
import ServiceCategoryCard from "../../components/services/ServiceCategoryCard";
import ServiceCategorySkeleton from "../../components/services/ServiceCategorySkeleton";
import ServiceItemsTable from "../../components/services/ServiceItemsTable";
import AddEditServiceItemForm from "../../components/services/AddEditServiceItemForm";
import AddEditCategoryModal from "../../components/services/AddEditCategoryModal";
import ServiceItemDetailModal from "../../components/services/ServiceItemDetailModal";
import ServicesStatsOverview from "../../components/services/ServicesStatsOverview";
import type { ServiceItem, ServiceCategory } from "../../store/useServiceStore";

export const ServicesPage: React.FC = () => {
  const {
    categories,
    items,
    selectedCategoryId,
    selectedCategoryName,
    activeCategory,
    viewMode,
    editingItem,
    editingCategory,
    isLoading,
    searchTerm,
    statusFilter,
    tagFilter,
    currentPage,
    itemsPerPage,
    filteredCategories,
    filteredItems,
    paginatedItems,
    setSearchTerm,
    setStatusFilter,
    setTagFilter,
    setCurrentPage,
    setViewMode,
    selectCategory,
    setEditingItem,
    setEditingCategory,
    handleToggleCategoryStatus,
    handleToggleItemStatus,
    handleToggleExpressDelivery,
    handleSaveItem,
    handleDeleteItem,
    handleSaveCategory,
  } = useServicesHook();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<ServiceItem | null>(null);

  // Switch views
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: ServiceCategory) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleOpenAddItem = () => {
    setEditingItem(null);
    setViewMode("add-item");
  };

  const handleOpenEditItem = (item: ServiceItem) => {
    setEditingItem(item);
    setViewMode("edit-item");
  };

  const handleSelectCategoryCard = (catId: string, catName: string) => {
    selectCategory(catId, catName);
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleBackToCategories = () => {
    selectCategory(null, null);
    setViewMode("categories");
    setSearchTerm("");
  };

  return (
    <div className="flex flex-col gap-lg pb-xl max-w-360 mx-auto">
      {/* ------------------------------------------------------------- */}
      {/* SCREEN 3: ADD / EDIT SERVICE ITEM FORM VIEW                    */}
      {/* ------------------------------------------------------------- */}
      {viewMode === "add-item" || viewMode === "edit-item" ? (
        <div className="animate-in fade-in duration-200">
          {/* Breadcrumbs for Form */}
          <nav aria-label="Breadcrumb" className="flex text-label-sm font-label-sm text-secondary mb-md">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <button
                  onClick={handleBackToCategories}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-secondary text-[16px] mx-1">
                    chevron_right
                  </span>
                  {selectedCategoryId ? (
                    <button
                      onClick={() => setViewMode("items")}
                      className="hover:text-primary transition-colors cursor-pointer"
                    >
                      {selectedCategoryName || "Items"}
                    </button>
                  ) : (
                    <span className="text-on-surface">Service Items</span>
                  )}
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-secondary text-[16px] mx-1">
                    chevron_right
                  </span>
                  <span className="text-on-surface font-semibold">
                    {viewMode === "edit-item" ? "Edit Item" : "Add Service Item"}
                  </span>
                </div>
              </li>
            </ol>
          </nav>

          <AddEditServiceItemForm
            key={editingItem?.id || editingItem?.documentId || "new-item"}
            item={editingItem}
            categories={categories}
            defaultCategoryId={selectedCategoryId}
            onSave={(payload) => {
              handleSaveItem(payload);
              setViewMode(selectedCategoryId ? "items" : "categories");
            }}
            onDiscard={() => {
              setViewMode(selectedCategoryId ? "items" : "categories");
            }}
          />
        </div>
      ) : (
        <>
          {/* ------------------------------------------------------------- */}
          {/* SCREEN 2: SERVICE ITEMS TABLE VIEW (Drill down)                */}
          {/* ------------------------------------------------------------- */}
          {viewMode === "items" && selectedCategoryId ? (
            <div className="flex flex-col gap-lg animate-in fade-in duration-200">
              {/* Breadcrumbs */}
              <nav aria-label="Breadcrumb" className="flex text-label-sm font-label-sm text-secondary">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                  <li className="inline-flex items-center">
                    <button
                      onClick={handleBackToCategories}
                      className="hover:text-primary transition-colors font-medium cursor-pointer"
                    >
                      Services
                    </button>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <span className="material-symbols-outlined text-secondary text-[16px] mx-1">
                        chevron_right
                      </span>
                      <span className="text-on-surface font-semibold">
                        {selectedCategoryName || activeCategory?.name || "Dry Cleaning"}
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                <div className="flex items-center gap-md">
                  <button
                    onClick={handleBackToCategories}
                    className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high text-secondary hover:text-primary transition-colors cursor-pointer"
                    title="Back to Categories"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div>
                    <h2 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-on-surface font-bold">
                      {selectedCategoryName || activeCategory?.name || "Dry Cleaning"} Items
                    </h2>
                    <p className="font-body-md text-body-md text-secondary mt-0.5">
                      Configure individual garment prices, promotional discounts, and express turnarounds.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenAddItem}
                  className="bg-primary text-on-primary px-lg py-sm rounded-lg font-title-md text-body-md hover:bg-surface-tint transition-colors flex items-center gap-xs w-fit shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add New Item
                </button>
              </div>

              {/* Data Table */}
              <ServiceItemsTable
                items={paginatedItems}
                isLoading={isLoading}
                totalCount={filteredItems.length}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={(val) => {
                  setSearchTerm(val);
                  setCurrentPage(1);
                }}
                onStatusFilterChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
                onPageChange={setCurrentPage}
                onToggleStatus={handleToggleItemStatus}
                onToggleExpressDelivery={handleToggleExpressDelivery}
                onViewItem={setViewingItem}
                onEditItem={handleOpenEditItem}
                onDeleteItem={handleDeleteItem}
                onAddNewItem={handleOpenAddItem}
              />
            </div>
          ) : (
            /* ------------------------------------------------------------- */
            /* SCREEN 1: SERVICES MANAGEMENT (Category Grid View)             */
            /* ------------------------------------------------------------- */
            <div className="flex flex-col gap-lg animate-in fade-in duration-200">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
                <div>
                  <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background font-semibold">
                    Services Management
                  </h2>
                  <p className="font-body-md text-body-md text-secondary mt-1">
                    Manage and configure service offerings across all facilities.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddCategory}
                  className="bg-primary text-on-primary px-lg py-sm rounded-lg font-title-md text-title-md flex items-center gap-sm hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined">add</span>
                  Add New Category
                </button>
              </div>

              {/* Stats Overview Metrics */}
              <ServicesStatsOverview
                categories={categories}
                items={items}
                isLoading={isLoading}
              />

              {/* Category Search & Tag Filters Bar */}
              <div className="flex flex-col sm:flex-row gap-md items-center justify-between bg-surface border border-outline-variant rounded-xl p-md shadow-xs">
                <div className="relative w-full sm:w-80">
                  <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-secondary">
                    search
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-2 pl-xl pr-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-on-surface"
                  />
                </div>

                <div className="flex items-center gap-md w-full sm:w-auto justify-between sm:justify-end">
                  {/* Tag Filter Pills */}
                  <div className="flex items-center gap-xs overflow-x-auto">
                    {["all", "Apparel", "Household", "Specialty"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTagFilter(t)}
                        className={`px-sm py-xs rounded-full text-label-sm transition-colors cursor-pointer font-medium ${
                          tagFilter === t
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-high text-secondary hover:bg-surface-container-highest"
                        }`}
                      >
                        {t === "all" ? "All Tags" : t}
                      </button>
                    ))}
                  </div>

                  {/* Status Toggle filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
                    className="bg-surface-container-lowest border border-outline-variant rounded-lg py-1.5 px-md text-body-md focus:border-primary outline-none text-on-surface cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>

              {/* Service Categories Grid */}
              {isLoading ? (
                <ServiceCategorySkeleton count={6} />
              ) : filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
                  {filteredCategories.map((cat) => (
                    <ServiceCategoryCard
                      key={cat.id}
                      category={cat}
                      onSelectCategory={handleSelectCategoryCard}
                      onToggleStatus={handleToggleCategoryStatus}
                      onEditCategory={handleOpenEditCategory}
                    />
                  ))}
                </div>
              ) : (
                <div className="col-span-full py-xl text-center text-secondary bg-surface border border-outline-variant rounded-xl p-xl">
                  <span className="material-symbols-outlined text-[48px] text-outline">
                    grid_off
                  </span>
                  <p className="font-title-md text-on-surface mt-sm">No Service Categories found</p>
                  <p className="font-body-md text-secondary">
                    Try adjusting your search criteria or create a new category.
                  </p>
                  <button
                    onClick={handleOpenAddCategory}
                    className="mt-md bg-primary text-on-primary px-md py-sm rounded-lg font-title-md text-body-md hover:bg-surface-tint inline-flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Add New Category
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Category Modal */}
      <AddEditCategoryModal
        key={editingCategory?.id || (isCategoryModalOpen ? "modal-open" : "modal-closed")}
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
      />

      {/* Item Details View Modal */}
      <ServiceItemDetailModal
        item={viewingItem}
        onClose={() => setViewingItem(null)}
        onEdit={(itemToEdit) => {
          setViewingItem(null);
          handleOpenEditItem(itemToEdit);
        }}
      />
    </div>
  );
};

export default ServicesPage;
