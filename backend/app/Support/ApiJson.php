<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ApiJson
{
    public static function camel(mixed $value): mixed
    {
        if ($value instanceof Model) {
            $value = $value->toArray();
        }
        if ($value instanceof Collection) {
            $value = $value->all();
        }
        if ($value instanceof \JsonSerializable) {
            $value = $value->jsonSerialize();
        }
        if (is_array($value)) {
            $result = [];
            foreach ($value as $key => $item) {
                $result[is_string($key) ? ($key === 'Name' ? 'Name' : Str::camel($key)) : $key] = self::camel($item);
            }

            return $result;
        }

        return $value;
    }
}
