import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import '../../home/presentation/listing_provider.dart';

class CreateListingScreen extends HookConsumerWidget {
  const CreateListingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final titleController = useTextEditingController();
    final descController = useTextEditingController();
    final priceController = useTextEditingController();
    final roomsController = useTextEditingController();
    final addressController = useTextEditingController();
    final selectedType = useState('Apartment');
    final isLoading = useState(false);
    final selectedImages = useState<List<XFile>>([]);
    final picker = useMemoized(() => ImagePicker());

    Future<void> pickImages() async {
      final images = await picker.pickMultiImage();
      if (images.isNotEmpty) {
        selectedImages.value = [...selectedImages.value, ...images];
      }
    }

    Future<void> submit() async {
      if (titleController.text.isEmpty || priceController.text.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please fill in required fields')),
        );
        return;
      }

      isLoading.value = true;
      try {
        await ref.read(listingRepositoryProvider).createListing(
          {
            'title': titleController.text,
            'description': descController.text,
            'price': priceController.text,
            'rooms': roomsController.text,
            'propertyType': selectedType.value,
            'address': addressController.text.isNotEmpty ? addressController.text : 'Unknown',
            'latitude': '0.0',
            'longitude': '0.0',
          },
          imagePaths: selectedImages.value.map((e) => e.path).toList(),
        );

        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Listing posted successfully!')),
          );
          Navigator.pop(context);
        }
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e')),
          );
        }
      } finally {
        isLoading.value = false;
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Post a Listing'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Property Details',
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: titleController,
                decoration: const InputDecoration(
                  hintText: 'Listing Title',
                  labelText: 'Title',
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: descController,
                maxLines: 4,
                decoration: const InputDecoration(
                  hintText: 'Describe your property...',
                  labelText: 'Description',
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: addressController,
                decoration: const InputDecoration(
                  hintText: 'Property Address',
                  labelText: 'Address',
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: priceController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        hintText: 'Price',
                        labelText: 'Price (\$/mo)',
                        prefixText: '\$ ',
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextField(
                      controller: roomsController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        hintText: 'Rooms',
                        labelText: 'No. of Rooms',
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              Text(
                'Property Type',
                style: GoogleFonts.outfit(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 12,
                children: ['Apartment', 'House', 'Villa', 'Office'].map((type) {
                  return TypeChip(
                    label: type,
                    isSelected: selectedType.value == type,
                    onSelected: (val) => selectedType.value = type,
                  );
                }).toList(),
              ),
              const SizedBox(height: 32),
              Text(
                'Photos',
                style: GoogleFonts.outfit(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              if (selectedImages.value.isNotEmpty)
                SizedBox(
                  height: 100,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: selectedImages.value.length + 1,
                    itemBuilder: (context, index) {
                      if (index == selectedImages.value.length) {
                        return GestureDetector(
                          onTap: pickImages,
                          child: Container(
                            width: 100,
                            margin: const EdgeInsets.only(right: 12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF5F7FA),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: const Icon(Icons.add_a_photo_outlined, color: Color(0xFF2D60FF)),
                          ),
                        );
                      }
                      return Container(
                        width: 100,
                        margin: const EdgeInsets.only(right: 12),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          image: DecorationImage(
                            image: FileImage(File(selectedImages.value[index].path)),
                            fit: BoxFit.cover,
                          ),
                        ),
                      );
                    },
                  ),
                )
              else
                GestureDetector(
                  onTap: pickImages,
                  child: Container(
                    height: 120,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.add_a_photo_outlined, color: Color(0xFF2D60FF), size: 32),
                        const SizedBox(height: 8),
                        Text(
                          'Add Photos',
                          style: GoogleFonts.outfit(
                            color: const Color(0xFF9A9FA5),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: 48),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: isLoading.value ? null : submit,
                  child: isLoading.value
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Post Property'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class TypeChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final Function(bool) onSelected;

  const TypeChip({
    super.key,
    required this.label,
    required this.onSelected,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: onSelected,
      backgroundColor: Colors.white,
      selectedColor: const Color(0xFF2D60FF).withValues(alpha: 0.1),
      checkmarkColor: const Color(0xFF2D60FF),
      labelStyle: GoogleFonts.outfit(
        color: isSelected ? const Color(0xFF2D60FF) : const Color(0xFF9A9FA5),
        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: isSelected ? const Color(0xFF2D60FF) : Colors.grey.shade200,
        ),
      ),
    );
  }
}
