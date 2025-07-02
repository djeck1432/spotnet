#!/usr/bin/env python3
"""
Validation script for AdminMixin implementation.

This script performs basic validation of the AdminMixin implementation
without requiring a full environment setup.
"""

import sys
import ast
import os
from typing import List, Dict, Any


def validate_file_syntax(file_path: str) -> bool:
    """Validate Python file syntax."""
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        ast.parse(content)
        print(f"✓ {file_path}: Syntax is valid")
        return True
    except SyntaxError as e:
        print(f"✗ {file_path}: Syntax error - {e}")
        return False
    except FileNotFoundError:
        print(f"✗ {file_path}: File not found")
        return False


def check_class_methods(file_path: str, class_name: str, expected_methods: List[str]) -> bool:
    """Check if a class has expected methods."""
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        tree = ast.parse(content)
        
        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef) and node.name == class_name:
                method_names = []
                for n in node.body:
                    if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        method_names.append(n.name)
                
                missing_methods = set(expected_methods) - set(method_names)
                if missing_methods:
                    print(f"✗ {class_name}: Missing methods - {missing_methods}")
                    return False
                else:
                    print(f"✓ {class_name}: All expected methods present - {expected_methods}")
                    return True
        
        print(f"✗ {class_name}: Class not found in {file_path}")
        return False
        
    except Exception as e:
        print(f"✗ Error checking {class_name}: {e}")
        return False


def check_imports(file_path: str, expected_imports: List[str]) -> bool:
    """Check if file has expected imports."""
    try:
        with open(file_path, 'r') as f:
            content = f.read()
        
        tree = ast.parse(content)
        
        import_names = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    import_names.append(alias.name)
            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    for alias in node.names:
                        import_names.append(f"{node.module}.{alias.name}")
        
        missing_imports = []
        for expected in expected_imports:
            found = any(expected in imp for imp in import_names)
            if not found:
                missing_imports.append(expected)
        
        if missing_imports:
            print(f"✗ {file_path}: Missing imports - {missing_imports}")
            return False
        else:
            print(f"✓ {file_path}: All expected imports present")
            return True
            
    except Exception as e:
        print(f"✗ Error checking imports: {e}")
        return False


def check_file_exists(file_path: str) -> bool:
    """Check if file exists."""
    if os.path.exists(file_path):
        print(f"✓ {file_path}: File exists")
        return True
    else:
        print(f"✗ {file_path}: File does not exist")
        return False


def validate_admin_mixin_implementation():
    """Validate the AdminMixin implementation."""
    print("🔍 Validating AdminMixin Implementation")
    print("=" * 50)
    
    validation_results = []
    
    # Check file existence
    files_to_check = [
        "app/contract_tools/__init__.py",
        "app/contract_tools/mixins/__init__.py", 
        "app/contract_tools/mixins/admin.py",
        "app/contract_tools/api_client.py",
        "app/api/admin.py",
        "app/schemas/admin.py",
        "app/tests/test_admin_mixin.py",
        "app/tests/test_admin_mixin_integration.py",
        "app/tests/api/test_admin_api.py"
    ]
    
    print("\n📁 Checking file existence:")
    for file_path in files_to_check:
        validation_results.append(check_file_exists(file_path))
    
    # Check syntax
    print("\n🔧 Validating Python syntax:")
    python_files = [f for f in files_to_check if f.endswith('.py')]
    for file_path in python_files:
        if os.path.exists(file_path):
            validation_results.append(validate_file_syntax(file_path))
    
    # Check AdminMixin class methods
    print("\n🏗️  Checking AdminMixin class structure:")
    expected_methods = ["get_current_prices", "get_asset_statistics"]
    validation_results.append(
        check_class_methods("app/contract_tools/mixins/admin.py", "AdminMixin", expected_methods)
    )
    
    # Check imports in AdminMixin
    print("\n📦 Checking AdminMixin imports:")
    expected_imports = ["BaseAPIClient", "user_pool_crud", "TokenParams", "Decimal"]
    validation_results.append(
        check_imports("app/contract_tools/mixins/admin.py", expected_imports)
    )
    
    # Check API endpoint structure
    print("\n🌐 Checking API endpoint:")
    api_file = "app/api/admin.py"
    if os.path.exists(api_file):
        with open(api_file, 'r') as f:
            content = f.read()
        
        # Check for the new endpoint
        if "/statistic/assets" in content and "get_asset_statistics" in content:
            print("✓ API endpoint: /admin/statistic/assets endpoint found")
            validation_results.append(True)
        else:
            print("✗ API endpoint: /admin/statistic/assets endpoint not found")
            validation_results.append(False)
    
    # Check schemas
    print("\n📋 Checking response schemas:")
    schema_file = "app/schemas/admin.py"
    if os.path.exists(schema_file):
        with open(schema_file, 'r') as f:
            content = f.read()
        
        required_schemas = ["AssetStatisticResponse", "AssetStatisticsResponse"]
        missing_schemas = [schema for schema in required_schemas if schema not in content]
        
        if missing_schemas:
            print(f"✗ Schemas: Missing schemas - {missing_schemas}")
            validation_results.append(False)
        else:
            print("✓ Schemas: All required schemas present")
            validation_results.append(True)
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Validation Summary:")
    total_checks = len(validation_results)
    passed_checks = sum(validation_results)
    failed_checks = total_checks - passed_checks
    
    print(f"✓ Passed: {passed_checks}")
    print(f"✗ Failed: {failed_checks}")
    print(f"📈 Success Rate: {(passed_checks/total_checks)*100:.1f}%")
    
    if failed_checks == 0:
        print("\n🎉 All validations passed! Implementation looks good.")
        return True
    else:
        print(f"\n⚠️  {failed_checks} validation(s) failed. Please review the issues above.")
        return False


def validate_implementation_requirements():
    """Validate that all implementation requirements are met."""
    print("\n🎯 Checking Implementation Requirements:")
    print("-" * 40)
    
    requirements = {
        "contract_tools package created": os.path.exists("app/contract_tools/__init__.py"),
        "AdminMixin with get_asset_statistics method": False,
        "BaseAPIClient improved version": os.path.exists("app/contract_tools/api_client.py"),
        "Admin API endpoint /statistic/assets": False,
        "Comprehensive tests created": os.path.exists("app/tests/test_admin_mixin.py"),
        "API endpoint tests created": False
    }
    
    # Check AdminMixin method
    admin_file = "app/contract_tools/mixins/admin.py"
    if os.path.exists(admin_file):
        with open(admin_file, 'r') as f:
            content = f.read()
        if "get_asset_statistics" in content and "user_pool" in content:
            requirements["AdminMixin with get_asset_statistics method"] = True
    
    # Check API endpoint
    api_file = "app/api/admin.py"
    if os.path.exists(api_file):
        with open(api_file, 'r') as f:
            content = f.read()
        if "/statistic/assets" in content:
            requirements["Admin API endpoint /statistic/assets"] = True
    
    # Check API tests
    api_test_file = "app/tests/api/test_admin_api.py"
    if os.path.exists(api_test_file):
        with open(api_test_file, 'r') as f:
            content = f.read()
        if "test_get_asset_statistics" in content:
            requirements["API endpoint tests created"] = True
    
    # Print results
    for requirement, status in requirements.items():
        status_icon = "✓" if status else "✗"
        print(f"{status_icon} {requirement}")
    
    all_met = all(requirements.values())
    print(f"\n{'✅' if all_met else '❌'} All requirements {'met' if all_met else 'NOT met'}")
    
    return all_met


if __name__ == "__main__":
    print("🚀 AdminMixin Implementation Validator")
    print("=" * 50)
    
    # Change to project directory if script argument provided
    if len(sys.argv) > 1:
        project_dir = sys.argv[1]
        os.chdir(project_dir)
        print(f"📂 Working directory: {os.getcwd()}")
    
    try:
        syntax_valid = validate_admin_mixin_implementation()
        requirements_met = validate_implementation_requirements()
        
        if syntax_valid and requirements_met:
            print("\n🎊 SUCCESS: Implementation is complete and ready for testing!")
            sys.exit(0)
        else:
            print("\n💥 FAILURE: Implementation needs attention before testing.")
            sys.exit(1)
            
    except Exception as e:
        print(f"\n💥 ERROR: Validation failed with exception: {e}")
        sys.exit(1)
