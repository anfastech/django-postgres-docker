from django.shortcuts import render, redirect
from .forms import UploadForm
from .models import Upload

def upload_view(request):
    if request.method == 'POST':
        form = UploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('upload_view')
    else:
        form = UploadForm()
    uploads = Upload.objects.all().order_by('-created_at')
    return render(request, 'uploads/upload.html', {'form': form, 'uploads': uploads})