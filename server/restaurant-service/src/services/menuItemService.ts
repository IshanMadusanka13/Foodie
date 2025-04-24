import MenuItem, { IMenuItem } from '../models/MenuItem';
import Restaurant from '../models/Restaurant';

const createMenuItem = async (data: Partial<IMenuItem>) => {
    const menuItem = new MenuItem(data);
    await menuItem.save();
    return menuItem.toObject();
};

const getMenuItemsByRestaurant = async (restaurantId: string, filters: Record<string, any> = {}) => {
    const query = { restaurantId, ...filters };
    return await MenuItem.find(query);
};

const getMenuItemById = async (id: string) => {
    return await MenuItem.findById(id);
};

const updateMenuItem = async (menuItemId: string, updateData: Partial<IMenuItem>) => {
    const updated = await MenuItem.findByIdAndUpdate(menuItemId, updateData, { new: true });
    if (!updated) {
        throw new Error("Menu item not found");
    }
    return updated;
};

const deleteMenuItem = async (menuItemId: string) => {
    const deleted = await MenuItem.findByIdAndDelete(menuItemId);
    if (!deleted) {
        throw new Error("Menu Item not Found");
    }
    return { message: `Menu item '${deleted.name}' deleted successfully` };
};

const getPaginatedMenuItems = async (restaurantId: string, filters: Record<string, any>, page: number = 1, limit: number = 10, search: string = "") => {
    const query = {
        restaurantId,
        ...filters,
        name: { $regex: search, $options: 'i' }
    };

    const items = await MenuItem.find(query)
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await MenuItem.countDocuments(query);

    return { items, total, page, pages: Math.ceil(total / limit) };
};

export default {
    createMenuItem,
    getMenuItemsByRestaurant,
    getMenuItemById,
    updateMenuItem,
    deleteMenuItem,
    getPaginatedMenuItems,
};
