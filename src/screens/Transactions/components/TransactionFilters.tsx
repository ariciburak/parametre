import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  TextStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '../../../components/common/Text';
import { BottomSheet } from '../../../components/common/BottomSheet';
import { colors, spacing } from '../../../theme';
import { categories } from '../../../constants/categories';
import { TransactionType } from '../../../constants/transactions';
import type { Category } from '../../../types/category';

interface FilterState {
  type?: TransactionType;
  categoryIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
    preset?: 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'last3Months' | 'custom';
  };
}

interface TransactionFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableCategories: Category[];
}

export const TransactionFilters = ({ filters, onFilterChange, availableCategories }: TransactionFiltersProps) => {
  const [showFilters, setShowFilters] = React.useState(false);

  // İşlem türü filtreleme
  const handleTypeFilter = (type: TransactionType | undefined) => {
    onFilterChange({
      ...filters,
      type: filters.type === type ? undefined : type,
    });
  };

  // Kategori filtreleme
  const handleCategoryFilter = (categoryId: string) => {
    onFilterChange({
      ...filters,
      categoryIds: filters.categoryIds?.includes(categoryId)
        ? filters.categoryIds.filter(id => id !== categoryId)
        : [...(filters.categoryIds || []), categoryId]
    });
  };

  // Filtreleri temizle
  const handleClearFilters = () => {
    onFilterChange({});
  };

  // Aktif filtre sayısını hesapla
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.type) count++;
    if (filters.categoryIds?.length) count += filters.categoryIds.length;
    if (filters.dateRange) count++;
    return count;
  }, [filters]);

  // Seçili kategorileri bul
  const selectedCategories = React.useMemo(() => {
    if (!filters.categoryIds?.length) return [];
    return categories.filter(c => filters.categoryIds?.includes(c.id));
  }, [filters.categoryIds]);

  // Kategori metin stili
  const getCategoryTextStyle = (category: { color: string }, isSelected: boolean): TextStyle[] => {
    const styles: TextStyle[] = [{ color: category.color }];
    if (isSelected) {
      styles.push({ fontWeight: '600' });
    }
    return styles;
  };

  const handleDatePreset = (preset: 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'last3Months' | 'custom') => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (preset) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        start.setDate(now.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        end.setDate(now.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case 'thisWeek':
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'thisMonth':
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'last3Months':
        start.setMonth(now.getMonth() - 3);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    onFilterChange({
      ...filters,
      dateRange: { start, end, preset },
    });
  };

  return (
    <>
      {/* Filtre Özet Barı */}
      <Pressable
        style={styles.filterBar}
        onPress={() => setShowFilters(true)}
      >
        <View style={[styles.filterSummary, { marginBottom: activeFilterCount > 0 ? spacing.sm : 0 }]}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={20}
            color={activeFilterCount > 0 ? colors.primary.main : colors.text.secondary}
          />
          <Text style={activeFilterCount > 0 ? styles.activeFilterText : styles.filterText}>
            {activeFilterCount > 0
              ? `${activeFilterCount} filtre aktif`
              : 'Filtrele'}
          </Text>
        </View>

        <View style={styles.filterBarContent}>
          {/* Aktif Filtreler */}
          {activeFilterCount > 0 && (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.activeFilters}
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
              >
                {filters.type && (
                  <View style={styles.activeFilterChip}>
                    <MaterialCommunityIcons
                      name={filters.type === 'income' ? 'arrow-down' : 'arrow-up'}
                      size={14}
                      color={filters.type === 'income' ? colors.success.main : colors.error.main}
                      style={styles.chipIcon}
                    />
                    <Text style={[styles.chipText, { color: filters.type === 'income' ? colors.success.main : colors.error.main }]}>
                      {filters.type === 'income' ? 'Gelir' : 'Gider'}
                    </Text>
                  </View>
                )}

                {selectedCategories.map(category => (
                  <View 
                    key={category.id}
                    style={[styles.activeFilterChip, { backgroundColor: category.color + '20' }]}
                  >
                    <MaterialCommunityIcons
                      name={category.icon}
                      size={14}
                      color={category.color}
                      style={styles.chipIcon}
                    />
                    <Text style={[styles.chipText, { color: category.color }]}>
                      {category.label}
                    </Text>
                  </View>
                ))}

                {filters.dateRange?.preset && (
                  <View style={styles.activeFilterChip}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={14}
                      color={colors.primary.main}
                      style={styles.chipIcon}
                    />
                    <Text style={[styles.chipText, { color: colors.primary.main }]}>
                      {filters.dateRange.preset === 'today' && 'Bugün'}
                      {filters.dateRange.preset === 'yesterday' && 'Dün'}
                      {filters.dateRange.preset === 'thisWeek' && 'Bu Hafta'}
                      {filters.dateRange.preset === 'thisMonth' && 'Bu Ay'}
                      {filters.dateRange.preset === 'last3Months' && 'Son 3 Ay'}
                    </Text>
                  </View>
                )}
              </ScrollView>

              <Pressable
                onPress={handleClearFilters}
                style={({ pressed }) => [
                  styles.clearFilterButton,
                  pressed && { opacity: 0.7 }
                ]}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={18}
                  color={colors.text.secondary}
                />
              </Pressable>
            </>
          )}
        </View>
      </Pressable>

      {/* Filtre Bottom Sheet */}
      <BottomSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        height={600}
        title="Filtreleme"
      >
        <ScrollView 
          style={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* İşlem Türü */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>İşlem Türü</Text>
            <View style={styles.typeFilters}>
              <Pressable
                style={[
                  styles.typeButton,
                  filters.type === 'income' && styles.typeButtonActive,
                ]}
                onPress={() => handleTypeFilter('income')}
              >
                <MaterialCommunityIcons
                  name="arrow-down"
                  size={20}
                  color={filters.type === 'income' ? colors.success.main : colors.text.secondary}
                />
                <Text style={filters.type === 'income' ? styles.typeTextActive : styles.typeText}>
                  Gelir
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.typeButton,
                  filters.type === 'expense' && styles.typeButtonActive,
                ]}
                onPress={() => handleTypeFilter('expense')}
              >
                <MaterialCommunityIcons
                  name="arrow-up"
                  size={20}
                  color={filters.type === 'expense' ? colors.error.main : colors.text.secondary}
                />
                <Text style={filters.type === 'expense' ? styles.typeTextActive : styles.typeText}>
                  Gider
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Kategoriler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kategoriler</Text>
            <View style={styles.categoryGrid}>
              {availableCategories.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    filters.categoryIds?.includes(category.id) && styles.categoryButtonActive,
                    { backgroundColor: category.color + '10' }
                  ]}
                  onPress={() => handleCategoryFilter(category.id)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <MaterialCommunityIcons
                      name={category.icon}
                      size={20}
                      color={category.color}
                    />
                  </View>
                  <Text style={[
                    styles.categoryText,
                    ...getCategoryTextStyle(category, filters.categoryIds?.includes(category.id) || false)
                  ]}>
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Tarih Aralığı Seçimi */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tarih Aralığı</Text>
            <View style={styles.datePresets}>
              <Pressable
                style={[
                  styles.datePresetButton,
                  filters.dateRange?.preset === 'today' && styles.datePresetButtonActive,
                ]}
                onPress={() => handleDatePreset('today')}
              >
                <Text style={filters.dateRange?.preset === 'today' ? styles.datePresetTextActive : styles.datePresetText}>
                  Bugün
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.datePresetButton,
                  filters.dateRange?.preset === 'yesterday' && styles.datePresetButtonActive,
                ]}
                onPress={() => handleDatePreset('yesterday')}
              >
                <Text style={filters.dateRange?.preset === 'yesterday' ? styles.datePresetTextActive : styles.datePresetText}>
                  Dün
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.datePresetButton,
                  filters.dateRange?.preset === 'thisWeek' && styles.datePresetButtonActive,
                ]}
                onPress={() => handleDatePreset('thisWeek')}
              >
                <Text style={filters.dateRange?.preset === 'thisWeek' ? styles.datePresetTextActive : styles.datePresetText}>
                  Bu Hafta
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.datePresetButton,
                  filters.dateRange?.preset === 'thisMonth' && styles.datePresetButtonActive,
                ]}
                onPress={() => handleDatePreset('thisMonth')}
              >
                <Text style={filters.dateRange?.preset === 'thisMonth' ? styles.datePresetTextActive : styles.datePresetText}>
                  Bu Ay
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.datePresetButton,
                  filters.dateRange?.preset === 'last3Months' && styles.datePresetButtonActive,
                ]}
                onPress={() => handleDatePreset('last3Months')}
              >
                <Text style={filters.dateRange?.preset === 'last3Months' ? styles.datePresetTextActive : styles.datePresetText}>
                  Son 3 Ay
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Temizle Butonu */}
          {activeFilterCount > 0 && (
            <Pressable
              style={styles.clearButton}
              onPress={handleClearFilters}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={colors.text.secondary}
              />
              <Text style={styles.clearButtonText}>
                Filtreleri Temizle
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  content: {
    padding: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  filterBar: {
    backgroundColor: colors.common.white,
    borderRadius: 12,
    marginHorizontal: spacing.screen.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[900],
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  filterSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  filterText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  activeFilterText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '600',
  },
  filterBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  activeFilters: {
    flexGrow: 1,
    marginRight: spacing.md,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginRight: spacing.xs,
  },
  chipIcon: {
    marginRight: 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bottomSheetContent: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  typeFilters: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.grey[50],
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },
  typeButtonActive: {
    backgroundColor: colors.grey[100],
  },
  typeText: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  typeTextActive: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  categoryButton: {
    width: '30%',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 12,
  },
  categoryButtonActive: {
    borderWidth: 2,
    borderColor: colors.primary.main + '30',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  clearFilterButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.grey[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  datePresets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  datePresetButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    backgroundColor: colors.grey[100],
  },
  datePresetButtonActive: {
    backgroundColor: colors.primary.main,
  },
  datePresetText: {
    fontSize: 14,
    color: colors.text.primary,
  },
  datePresetTextActive: {
    color: colors.common.white,
  },
}); 